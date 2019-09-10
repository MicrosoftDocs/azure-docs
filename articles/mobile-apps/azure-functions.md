---
title: Azure Functions
description: How to build serverless mobile apps using Azure Functions
author: elamalani
​
ms.assetid:  98899889-9b3c-4faf-8974-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 09/04/2019
ms.author: emalani
---​

# Serverless Compute with Azure Functions

Every mobile application needs a backend that is responsible for data storage, business logic, and security. Managing the infrastucture to host and execute backend code requires you to size, provision and scale a bunch of servers, manage OS updates and hardware involved, apply security patches and then monitor all these infrastructure for performance, availability, and fault tolerance. This is when serverless architecture comes very handy as developers have no servers to manage, no OS, or related software/hardware updates to manage and it saves a lot of developer time and cost which means faster time to market and focused energy on building application code logic. 

**Benefits of serverless compute includes:**
- Abstraction of servers without having to worry about hosting, patching, and security to just focus on the code.
- Instant and efficient scaling as the resources to run the code is  provisioned automatically and on demand at whatever scale you might be requesting.
- High availabilty and fault tolerance. 
- No idle capacity and micro billing as you are only billed for when your code is actually running.
- Write code that runs in the cloud in your choice of any language.
​
## Azure Functions
[Azure Functions](https://azure.microsoft.com/en-us/services/functions/) is an event-driven compute experience that allows you to execute your code, written in the programming language of your choice, without worrying about servers. Developers dont have to manage the application or the infrastructure to run it on. Functions scale on demand and you pay only for the time your code runs. Azure Functions are a great way to implement an API for a mobile application because they are very easy to implement and maintain, and accessible through HTTP.
​
## Features of Azure Functions
- **Event driven and scalable** where developers can use **triggers and bindings** to define when a function is invoked and to what data it connects.
- **Bring your own dependencies** - Functions supports NuGet and NPM, so you can use your favorite libraries.
- **Integrated security** lets you protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.
- **Simplified integration** with different [Azure services](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview#integrations) and software-as-a-service (SaaS) offerings.
- **Flexible development** lets you code your functions right in the portal or set up continuous integration and deploy your code through GitHub, Azure DevOps Services, and other supported development tools.
- The Functions runtime is **open-source** and available on [GitHub](https://github.com/azure/azure-webjobs-sdk-script).
- **Enhanced development experience** where developers can code, test and debug locally using their preferred editor or easy-to-use web interface with monitoring with integrated tools and built-in DevOps capabilities
- **Variety of programming languages** (develop using C#, Node.js, Java, Javascript, or Python) and hosting options.
- **Pay-per-use pricing model** - Pay only for the time spent running your code. 
​
 ## References
   - [Azure Portal](https://portal.azure.com) to create Function app
   - [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
   - [Azure Functions Developer Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference)