import { LayoutBase } from "ui/layouts/layout-base";
import { FrameLayout as FrameLayoutDefinition } from "frame-layout";
import { Property, PropertyChangeData } from "ui/core/dependency-observable";
import { View } from "ui/core/view";
import { Dock } from "ui/enums";
import { PropertyMetadata } from "ui/core/proxy";
import { registerSpecialProperty } from "ui/builder/special-properties";

function validateArgs(element: View): View {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}

registerSpecialProperty("gravity", (instance, propertyValue) => {
    FrameLayout.setGravity(instance, propertyValue);
});

export class FrameLayout extends LayoutBase implements FrameLayoutDefinition {

    private static onGravityPropertyChanged(data: PropertyChangeData) {
        var uiView = data.object;
        if (uiView instanceof View) {
            var layout = uiView.parent;
            if (layout instanceof FrameLayout) {
                layout.onDockChanged(uiView, data.oldValue, data.newValue);
            }
        }
    }

    public static gravityProperty = new Property("gravity", "FrameLayout",
        new PropertyMetadata("", undefined, FrameLayout.onGravityPropertyChanged, FrameLayout.isGravityValid));

    public static getGravity(element: View): string {
        return validateArgs(element)._getValue(FrameLayout.gravityProperty);
    }

    public static setGravity(element: View, value: string): void {
        validateArgs(element)._setValue(FrameLayout.gravityProperty, value);
    }

    protected onDockChanged(view: View, oldValue: string, newValue: string) {
        //
    }
    
    public static isGravityValid(value: any): boolean {
        return value.trim.length ==0 || value === Dock.left || value === Dock.top || value === Dock.right || value === Dock.bottom;
    }
}