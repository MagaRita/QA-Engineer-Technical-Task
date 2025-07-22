import { test } from "@playwright/test";

export function step(target: any, context: ClassMethodDecoratorContext): any {
	return function replacementMethod(this: any, ...args: any[]) {
		const className = this.constructor.name;
        const methodName = context.name as string;

        const formattedArgs = args.map(arg => {
			if (typeof arg === "object") {
				return JSON.stringify(arg);
            }
			return arg?.toString();
		}).join(", ");

		const stepName = `${className}.${methodName}(${formattedArgs})`;

		return test.step(stepName, async () => {
			return await target.call(this, ...args);
        });
    };
}