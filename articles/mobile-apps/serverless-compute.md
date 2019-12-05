---
title: Build serverless mobile application backend with Azure Functions and other services
description: Learn about the Compute services to build solid, serverless mobile application backend.
author: elamalani
manager: elamalani
ms.service: vs-appcenter
ms.assetid: 444f0959-aa7f-472c-a6c7-9eecea3a34b9
ms.topic: conceptual
ms.date: 10/22/2019
ms.author: emalani
---

# Build mobile backend components with Compute services
Every mobile application needs a backend that is responsible for data storage, business logic, and security. Managing the infrastructure to host and execute backend code requires you to size, provision and scale a bunch of servers, manage OS updates and hardware involved, apply security patches and then monitor all of these infrastructure components for performance, availability, and fault tolerance. This is when serverless architecture comes in handy as developers have no servers to manage, no OS, or related software/hardware updates to manage. It saves a lot of developer time and cost which means faster time-to-market and focused energy on building applications.

## Benefits of Compute
- Abstraction of servers: no need to worry about hosting, patching, and security, allowing developers to just focus on the code.
- Instant and efficient scaling ensures resources are provisioned automatically or on-demand at whatever scale you need.
- High availability and fault tolerance.
- Micro billing ensures you are only billed for when your code is actually running.
- Write code that runs in the cloud in the language of your choice.

Use the following services to enable serverless compute capabilities in your mobile apps.

## Azure Functions
[Azure Functions](https://azure.microsoft.com/services/functions/) is an event-driven compute experience that allows you to execute your code, written in the programming language of your choice, without worrying about servers. Developers don't have to manage the application or the infrastructure to run it on. Functions scale on demand and you pay only for the time your code runs. Azure Functions are a great way to implement an API for a mobile application because they are very easy to implement and maintain, and accessible through HTTP.

**Key features**
- **Event-driven and scalable** where developers can use **triggers and bindings** to define when a function is invoked and to what data it connects.
- **Bring your own dependencies** - Functions supports NuGet and NPM, so you can use your favorite libraries.
- **Integrated security** lets you protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.
- **Simplified integration** with different [Azure services](/azure/azure-functions/functions-overview#integrations) and software-as-a-service (SaaS) offerings.
- **Flexible development** lets you code your functions right in the portal or set up continuous integration and deploy your code through GitHub, Azure DevOps Services, and other supported development tools.
- The Functions runtime is **open-source** and available on [GitHub](https://github.com/azure/azure-webjobs-sdk-script).
-  **Enhanced development experience** where developers can code, test and debug locally using their preferred editor or easy-to-use web interface with monitoring with integrated tools and built-in DevOps capabilities.
- **Variety of programming languages and hosting options** - develop using C#, Node.js, Java, Javascript, or Python.
- **Pay-per-use pricing model** - Pay only for the time spent running your code.

**References**
- [Azure portal](https://portal.azure.com)
- [Documentation](/azure/azure-functions/)
- [Azure Functions Developer Guide](/azure/azure-functions/functions-reference)
- [Quickstarts](/azure/azure-functions/functions-create-first-function-vs-code)
- [Samples](/samples/browse/?products=azure-functions&languages=csharp)

## App Service
[Azure App Service](https://azure.microsoft.com/services/app-service/) Azure App Service enables you to build and host web apps, and RESTful APIs in the programming language of your choice without managing infrastructure. It offers auto-scaling and high availability, supports both Windows and Linux, and enables automated deployments from GitHub, Azure DevOps, or any Git repo.

**Key features**
- **Multiple languages and frameworks** support for ASP.NET, ASP.NET Core, Java, Ruby, Node.js, PHP, or Python. You can also run PowerShell and other scripts or executables as background services.
- **DevOps optimization** - Set up continuous integration and deployment with Azure DevOps, GitHub, BitBucket, Docker Hub, or Azure Container Registry. Manage your apps in App Service by using Azure PowerShell or the cross-platform command-line interface (CLI).
- **Global scale with high availability** to scale up or out manually or automatically.
- **Connections to SaaS platforms and on-premises data** to choose from more than 50 connectors for enterprise systems (such as SAP), SaaS services (such as Salesforce), and internet services (such as Facebook). Access on-premises data using Hybrid Connections and Azure Virtual Networks.
- **Security and compliance** - Azure App Service is ISO, SOC, and PCI compliant. Authenticate users with Azure Active Directory or with social login (Google, Facebook, Twitter, and Microsoft). Create IP address restrictions and manage service identities.
- **Application templates** to choose from an extensive list of application templates in the Azure Marketplace, such as WordPress, Joomla, and Drupal.
- **Visual Studio integration** with dedicated tools in Visual Studio streamline the work of creating, deploying, and debugging.

**References**
- [Azure portal](https://portal.azure.com/)
- [Documentation](/azure/app-service/)
- [Quickstarts](/azure/app-service/app-service-web-get-started-dotnet)
- [Samples](/azure/app-service/samples-cli)
- [Tutorials](/azure/app-service/app-service-web-tutorial-dotnetcore-sqldb)

## Azure Kubernetes Service (AKS)
[Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) manages your hosted Kubernetes environment, making it quick and easy to deploy and manage containerized applications without container orchestration expertise. It also eliminates the burden of ongoing operations and maintenance by provisioning, upgrading, and scaling resources on demand, without taking your applications offline. 
​
**Key features**
- **Easily migrate existing applications** to Containers and run within AKS.
- **Simplify the deployment and management** of Microservices based applications.
- **Secure DevOps for AKS** to achieve balance between speed and security and deliver code faster at scale.
- **Scale with ease using AKS and ACI** to provision pods inside ACI that start in seconds.
- **IoT device deployment and management** on demand.
- **Machine learning model training** with use of tools such as TensorFlow and KubeFlow.

**References**
- [Azure portal](https://portal.azure.com/)
- [Documentation](/azure/aks/)
- [Quickstarts](/azure/aks/kubernetes-walkthrough-portal)
- [Tutorials](/azure/aks/tutorial-kubernetes-prepare-app)

## Azure Container Instances
[Azure Container Instances (ACI)](https://azure.microsoft.com/services/container-instances/) is a great solution for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs. Develop apps fast without managing VMs.

**Key features**
- **Fast startup times** as ACI can start containers in Azure in seconds, without the need to provision and manage VMs.
- **Public IP connectivity and custom DNS name**.
- **Hypervisor-level security** that guarantees your application is as isolated in a container as it would be in a VM.
- **Custom sizes** for  optimum utilization by allowing exact specifications of CPU cores and memory. You pay based on what you need and get billed by the second, so you can fine-tune your spending based on actual need.
- **Persistent storage** to retrieve and persist state, ACI offers direct mounting of Azure Files shares.
- **Linux and Windows containers** scheduled with the same API.

**References**
- [Azure portal](https://portal.azure.com/)
- [Documentation](/azure/container-instances/)
- [Quickstarts](/azure/container-instances/container-instances-quickstart-portal)
- [Samples](https://azure.microsoft.com/resources/samples/?sort=0&term=aci)
- [Tutorials](/azure/container-instances/container-instances-tutorial-prepare-app)