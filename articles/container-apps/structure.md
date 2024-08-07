
# Compute and billing structures in Azure Container Apps

Every application in Container Apps runs in an environment. Environments are available in two different variations:

- **Workload profiles environment**: The workload profiles environment allows you to run compute resources specifically tailored to the needs of your application. Within a workload profiles environment you have the option to run your container app with dedicated and specialized compute resources, or in a consumption context. These different contexts are known are *workload profiles*.

- **Consumption-only environment**: The consumption-only environment, runs your application using compute resources exclusively allocated on-demand.

Features and billing considerations are determined by the plan used by your environment:

- **Consumption plan**: The consumption workload profile and Consumption-only environment both work on the consumption plan.

- **Dedicated plan**: Dedicated workload profiles run on the dedicated plan.

In summary:

- Plans dictate the costs associated with running your apps and influences the features available to your apps.
- Workload profiles determine what type of compute resources are available to your apps.
- The environment type dictates whether or not you can use a workload profile, or if your container app works in a consumption-only context.


------

For workload profiles, it might be good to lead with you can run the Consumption and/or the Dedicated plans. I'd also mention that it provides an optimized networking stack than the Consumption only environments. Also, should we mentione that by default, workload profiles environments run with consumption and dedicated can be added?
 
Should we just say for 'dedicated plan' that dedicated workload profiles run on the dedicated plan?

------

## FAQ

### Can you have more than one consumption profile running in a workload profiles environment?

No. Every workload profiles environment comes with a single consumption profile by default. You use this profile for all your consumption needs.

### Can I remove the consumption profile from workload profiles environment?

No. If you don't need the consumption profile, just don't use it. As typical with consumption billing, you aren't charged for the consumption profile if you don't use it.

### Does the consumption plan work the same way in an workload profiles environment vs. a consumption-only environment?

No. There are some distinctions between how the consumption plan operates among the workload profiles and consumption-only plans. Some networking features are different in a workload profiles environment. For instance, UDR is only available in a workload profiles environment, and subnet sizes differ, and IP addresses are assigned differently depending on the environment type.