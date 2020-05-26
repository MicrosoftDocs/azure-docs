# OpenShift in a Hardened Zero Trust Azure Environment

This article defines and helps you execute a product-ready DevSecOps ecosystem that may be used with high-governance workloads on Azure.

## Summary
With our solution we’ve aimed to help app developers and security administrators achieve DevSecOps in a few different cutting-edge ways. The benefits here are three-fold: 
* *Increases speed of deployment and delivery.* This is the Dev part of DevSecOps – Developers get to focus on what matters, which is writing code and building and delivering application workloads at speed.
* *Advanced security posture.* The Sec part of DevSecOps – Security needs to be at the heart of DoD software development. In our hierarchal Zero Trust solution, each level of the production architecture inherits security from the level below it. This results in a continuously hardened environment from infra all the way up to the workload running on top of it all. We ensure security extends throughout your digital estate
* *Makes compliance easier to monitor and achieve.* The Ops part of DevSecOps can be seriously time-consuming. Our entire DevSecOps environment is continuously defensible with 24-hour compliance checks against DoD requirements, which ensures limited or no drift. This greatly reduces operational overhead and allows your team to run their services, 24-7 with confidence

> [!NOTE]
> If you would like a video tutorial on the solution [see demo video here](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
> 
> 

## Next steps
Here are the architectural components of the solution and how to use them.
![Alt](/pyramid.png "Pyramid")

* *Secure Infrastructure*. Use the [Zero Trust Blueprint](https://github.com/Azure/ato-toolkit/tree/master/automation/zero-trust-architecture) to setup strongly governed components like networking, storage, and monitoring that abide by the Zero Trust "never trust, always verify" philosophy. When you leverage a Zero Trust model it becomes possible to ensure every request is authenticated, authorized, and inspected before granting access.
* *Container Orchestration*. Use the secure OpenShift deployment
* *Workload*. Use the Iron Bank verification script to ensure you're using a secure Docker image 

> [!NOTE]
> If you still have further questions, please [contact Azure Gov](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
