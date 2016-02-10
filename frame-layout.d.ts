declare module "frame-layout" {
	import { LayoutBase } from 'ui/layouts/layout-base';
	import { View } from "ui/core/view";
	import { Property } from "ui/core/dependency-observable";
	
	class FrameLayout extends LayoutBase {
		public static gravityProperty : Property;
		static getGravity(view : View) : string;
		static setGravity(view : View, value : string) : void;	
	}
}