import { layout } from "utils/utils";
import { View } from "ui/core/view";
import { Dock } from "ui/enums";

import common = require("./frame-layout-common");

global.moduleMerge(common, exports);

export class FrameLayout extends common.FrameLayout {

    protected onGravityChanged(view: View, oldValue: number, newValue: number) { 
        this.requestLayout();
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);

        var measureWidth = 0;
        var measureHeight = 0;

        var width = layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

        var height = layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = layout.getMeasureSpecMode(heightMeasureSpec);

        var density = layout.getDisplayDensity();

        var remainingWidth = widthMode === layout.UNSPECIFIED ? Number.MAX_VALUE : width - ((this.paddingLeft + this.paddingRight) * density);
        var remainingHeight = heightMode === layout.UNSPECIFIED ? Number.MAX_VALUE : height - ((this.paddingTop + this.paddingBottom) * density);

        var childWidthMeasureSpec: number;
        var childHeightMeasureSpec: number;
        var count = this.getChildrenCount();
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }

            // Measure children with AT_MOST even if our mode is EXACT
            switch(FrameLayout.getGravity(child)) {
                case Dock.top:
                case Dock.bottom:
                    childWidthMeasureSpec = layout.makeMeasureSpec(remainingWidth, widthMode);
                    childHeightMeasureSpec = layout.makeMeasureSpec(remainingHeight, heightMode === layout.EXACTLY ? layout.AT_MOST : heightMode);
                    break;
                
                case Dock.left:
                case Dock.right:
                    childWidthMeasureSpec = layout.makeMeasureSpec(remainingWidth, widthMode === layout.EXACTLY ? layout.AT_MOST : widthMode);
                    childHeightMeasureSpec = layout.makeMeasureSpec(remainingHeight, heightMode);
                    break;
                
                default:
                    childWidthMeasureSpec = layout.makeMeasureSpec(remainingWidth, widthMode);
                    childHeightMeasureSpec = layout.makeMeasureSpec(remainingHeight, heightMode);
                    break;
            }
            
            var childSize = View.measureChild(this, child, childWidthMeasureSpec, childHeightMeasureSpec);
            measureWidth = Math.max(measureWidth, childSize.measuredWidth);
            measureHeight = Math.max(measureHeight, childSize.measuredHeight);
        }

        measureWidth += (this.paddingLeft + this.paddingRight) * density;
        measureHeight += (this.paddingTop + this.paddingBottom) * density;

        measureWidth = Math.max(measureWidth, this.minWidth * density);
        measureHeight = Math.max(measureHeight, this.minHeight * density);

        var widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);

        this.setMeasuredDimension(widthAndState, heightAndState);
    }


    public onLayout(left: number, top: number, right: number, bottom: number): void {
        super.onLayout(left, top, right, bottom);

        var density = layout.getDisplayDensity();
        var count = this.getChildrenCount();
        
        var remainingWidth = Math.max(0, right - left - ((this.paddingLeft + this.paddingRight) * density));
        var remainingHeight = Math.max(0, bottom - top - ((this.paddingTop + this.paddingBottom) * density));

        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }

            let childLeft : number, childTop: number;
            var childWidth = child.getMeasuredWidth() + (child.marginLeft + child.marginRight) * density;
            var childHeight = child.getMeasuredHeight() + (child.marginTop + child.marginBottom) * density;

            switch(FrameLayout.getGravity(child)) {
                case Dock.top:
                    childWidth = remainingWidth;
                    childLeft = this.paddingLeft * density;
                    childTop = this.paddingTop * density;
                    break;
                case Dock.bottom:
                    childWidth = remainingWidth;
                    childLeft = this.paddingLeft * density;
                    childTop = remainingHeight - childHeight;
                    break;
                case Dock.right:
                    childHeight = remainingHeight;
                    childTop = this.paddingTop * density;
                    childLeft = remainingWidth - childWidth;
                    break;
                case Dock.left:
                    childHeight = remainingHeight;
                    childTop = this.paddingTop * density;
                    childLeft = this.paddingLeft * density;
                    break;
                default : 
                    childWidth = remainingWidth;
                    childHeight = remainingHeight;
                    childLeft = this.paddingLeft * density;
                    childTop = this.paddingRight * density;
                    break;
            }

            View.layoutChild(this, child, childLeft, childTop, childLeft + childWidth, childTop + childHeight);
        }
    }
}