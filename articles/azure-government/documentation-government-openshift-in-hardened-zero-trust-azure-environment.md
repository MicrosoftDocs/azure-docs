# OpenShift in a Hardened Zero Trust Azure Environment

This article defines and helps you execute a production-ready DevSecOps ecosystem that may be used with Government workloads on Azure.

## Benefits of the solution
This solution aims to help app developers and security administrators achieve DevSecOps in a few different cutting-edge ways. The benefits of the ecosystem are three-fold: 
* *Increases speed of deployment and delivery.* This is the Dev part of DevSecOps – Developers get to focus on writing code and building and delivering application workloads at speed.
* *Advanced security posture.* The Sec part of DevSecOps – Security needs to be at the heart of DoD software development. In our hierarchal Zero Trust solution, each level of the production architecture inherits security from the level below it. This results in a continuously hardened environment from infra all the way up to the workload running on top of it all. We ensure security extends throughout your digital estate
* *Makes compliance easier to monitor and achieve.* The Ops part of DevSecOps can be seriously time-consuming. Our entire DevSecOps environment is continuously defensible with 24-hour compliance checks against DoD requirements, which ensures limited or no drift. This greatly reduces operational overhead and allows your team to run their services, 24-7 with confidence

## Components of the solution
Here are the architectural components of the solution.
![Pyramid](../media/pyramid.PNG)

* *Secure Infrastructure*. This layer is secure infrastructure. Developers and security admins need strongly governed components like networking, storage, and monitoring, that abide by the Zero Trust “never trust, always verify” philosophy. When you leverage a Zero Trust model it becomes possible to ensure every request is authenticated, authorized, and inspected before granting access.
* *Container Orchestration*. This layer is the container orchestration part of the architecture that deploys and manages Kubernetes nodes. Your compute solution also should be setup and leveraged in a secure way. This is a secure deployment of RedHat OpenShift on Azure. The deployment is unique as it’s (1) fully automated and runs quickly with close to 1-click and (2) has hardening baked-in, including a script that STIGs all host OSes. All of this neatly deploys on top of the Zero Trust Blueprint – inheriting and building on its security and allowing your architecture to remain compliant.
* *Workload*. Lastly, we have the top layer - deploying your application workload! Here you pull a trusted container image from [Iron Bank](https://ironbank.dsop.io), which is the DoD’s central repository for hardened Docker images, and use it to seamlessly deploy a basic web app.

## Deploying the solution
* *Secure Infrastructure*. Use the [Zero Trust Blueprint](https://github.com/Azure/ato-toolkit/tree/master/automation/zero-trust-architecture) to setup strongly governed components like networking, storage, and monitoring that abide by the Zero Trust "never trust, always verify" philosophy on Azure
* *Container Orchestration*. Use the secure OpenShift deployment
* *Workload*. Use the Iron Bank verification script to ensure you're using a secure Docker image 

> [!NOTE]
> If you would like to see a video tutorial on the solution [see demo video here](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
> 
> 
