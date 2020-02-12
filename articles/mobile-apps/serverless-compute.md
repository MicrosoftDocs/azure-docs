---
title: Build a serverless mobile application back end with Azure Functions and other services
description: Learn about the compute services used to build a solid, serverless mobile application back end.
author: elamalani
manager: elamalani
ms.service: vs-appcenter
ms.assetid: 444f0959-aa7f-472c-a6c7-9eecea3a34b9
ms.topic: conceptual
ms.date: 10/22/2019
ms.author: emalani
---

# Build mobile back-end components with compute services
Every mobile application needs a back end that's responsible for data storage, business logic, and security. Managing the infrastructure to host and execute back-end code requires you to size, provision, and scale multiple servers. You also have to manage OS updates and the hardware involved and apply security patches. Then you need to monitor all of these infrastructure components for performance, availability, and fault tolerance. 

Serverless architecture comes in handy for this type of scenario because you have no servers to manage and no OS or related software or hardware updates to manage. Serverless architecture saves developer time and cost, which means faster time to market and focused energy on building applications.

## Benefits of compute
- Abstraction of servers means there's no need to worry about hosting, patching, and security, which allows you to focus solely on the code.
- Instant and efficient scaling ensures that resources are provisioned automatically or on demand at whatever scale you need.
- High availability and fault tolerance.
- Micro-billing ensures that you're only billed for when your code is actually running.
- Code runs in the cloud written in the language of your choice.

Use the following services to enable serverless compute capabilities in your mobile apps.

## Azure Functions
[Azure Functions](https://azure.microsoft.com/services/functions/) is an event-driven compute experience that you can use to execute your code, written in the programming language of your choice, without worrying about servers. You don't have to manage the application or the infrastructure to run it on. Functions scale on demand, and you pay only for the time your code runs. Azure functions are a great way to implement an API for a mobile application. They're easy to implement and maintain and are accessible through HTTP.

**Key features**
- Event-driven and scalable where you can use triggers and bindings to define when a function is invoked and to what data it connects.
- Bring your own dependencies because Functions supports NuGet and NPM, so you can use your favorite libraries.
- Integrated security so that you can protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.
- Simplified integration with different [Azure services](/azure/azure-functions/functions-overview) and software as a service (SaaS) offerings.
- Flexible development so that you can code your functions right in the Azure portal or set up continuous integration and deploy your code through GitHub, Azure DevOps Services, and other supported development tools.
- Functions runtime is open source and available on [GitHub](https://github.com/azure/azure-webjobs-sdk-script).
- Enhanced development experience where you can code, test, and debug locally by using their preferred editor or easy-to-use web interface with monitoring with integrated tools and built-in DevOps capabilities.
- Variety of programming languages and hosting options for developing, such as C#, Node.js, Java, JavaScript, or Python.
- Pay-per-use pricing model means you pay only for the time spent running your code.

**References**
- [Azure portal](https://portal.azure.com)
- [Azure Functions documentation](/azure/azure-functions/)
- [Azure Functions developer guide](/azure/azure-functions/functions-reference)
- [Quickstarts](/azure/azure-functions/functions-create-first-function-vs-code)
- [Samples](/samples/browse/?products=azure-functions&languages=csharp)

## Azure App Service
With [Azure App Service](https://azure.microsoft.com/services/app-service/), you can build and host web apps and RESTful APIs in the programming language of your choice without managing infrastructure. It offers autoscaling and high availability, supports both Windows and Linux, and enables automated deployments from GitHub, Azure DevOps, or any Git repo.

**Key features**
- Multiple language and framework support for ASP.NET, ASP.NET Core, Java, Ruby, Node.js, PHP, or Python. You can also run PowerShell and other scripts or executables as background services.
- DevOps optimization through continuous integration and deployment with Azure DevOps, GitHub, BitBucket, Docker Hub, or Azure Container Registry. Manage your apps in App Service by using Azure PowerShell or the cross-platform command-line interface (CLI).
- Global scale with high availability to scale up or out manually or automatically.
- Connections to SaaS platforms and on-premises data to choose from more than 50 connectors for enterprise systems such as SAP, SaaS services such as Salesforce, and internet services such as Facebook. Access on-premises data by using hybrid connections and Azure Virtual Networks.
- Azure App Service is ISO, SOC, and PCI compliant. Authenticate users with Azure Active Directory or with sign-in for social media such as Google, Facebook, Twitter, and Microsoft. Create IP address restrictions and manage service identities.
- Application templates to choose from an extensive list of application templates in Azure Marketplace, such as WordPress, Joomla, and Drupal.
- Visual Studio integration with dedicated tools in Visual Studio streamlines the work of creating, deploying, and debugging.

**References**
- [Azure portal](https://portal.azure.com/)
- [Azure App Service documentation](/azure/app-service/)
- [Quickstarts](/azure/app-service/app-service-web-get-started-dotnet)
- [Samples](/azure/app-service/samples-cli)
- [Tutorials](/azure/app-service/app-service-web-tutorial-dotnetcore-sqldb)

## Azure Kubernetes Service
[Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) manages your hosted Kubernetes environment. AKS makes it quick and easy to deploy and manage containerized applications without container orchestration expertise. It also eliminates the burden of ongoing operations and maintenance. AKS provisions, upgrades, and scales resources on demand, without taking your applications offline.

**Key features**
- Easily migrate existing applications to containers and run within AKS.
- Simplify the deployment and management of microservices-based applications.
- Secure DevOps for AKS to achieve balance between speed and security and deliver code faster at scale.
- Scale with ease by using AKS and Azure Container Instances to provision pods inside Container Instances that start in seconds.
- Deploy and manage IoT devices on demand.
- Train machine learning models with the use of tools such as TensorFlow and KubeFlow.

**References**
- [Azure portal](https://portal.azure.com/)
- [Azure Kubernetes Service documentation](/azure/aks/)
- [Quickstarts](/azure/aks/kubernetes-walkthrough-portal)
- [Tutorials](/azure/aks/tutorial-kubernetes-prepare-app)

## Azure Container Instances
[Azure Container Instances](https://azure.microsoft.com/services/container-instances/) is a great solution for any scenario that can operate in isolated containers, such as simple applications, task automation, and build jobs. Develop apps fast without managing VMs.

**Key features**
- Fast startup times as Container Instances can start containers in Azure in seconds, without the need to provision and manage VMs.
- Public IP connectivity and custom DNS name.
- Hypervisor-level security that guarantees your application is as isolated in a container as it would be in a VM.
- Custom sizes for optimum utilization by allowing exact specifications of CPU cores and memory. You pay based on what you need and get billed by the second, so you can fine-tune your spending based on actual need.
- Persistent storage to retrieve and persist state. Container Instances offers direct mounting of Azure Files shares.
- Linux and Windows containers scheduled with the same API.

**References**
- [Azure portal](https://portal.azure.com/)
- [Azure Container Instances documentation](/azure/container-instances/)
- [Quickstarts](/azure/container-instances/container-instances-quickstart-portal)
- [Samples](https://azure.microsoft.com/resources/samples/?sort=0&term=aci)
- [Tutorials](/azure/container-instances/container-instances-tutorial-prepare-app)