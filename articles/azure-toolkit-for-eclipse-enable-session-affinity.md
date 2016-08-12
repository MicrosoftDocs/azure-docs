<properties
    pageTitle="Enable Session Affinity using the Azure Toolkit for Eclipse"
    description="Learn how to enable session affinity using the Azure Toolkit for Eclipse."
    services=""
    documentationCenter="java"
    authors="rmcmurray"
    manager="wpickett"
    editor=""/>

<tags
    ms.service="multiple"
    ms.workload="na"
    ms.tgt_pltfrm="multiple"
    ms.devlang="Java"
    ms.topic="article"
    ms.date="08/11/2016" 
    ms.author="robmcm"/>

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh690950.aspx -->

# Enable Session Affinity #

Within the Azure Toolkit for Eclipse, you can enable HTTP session affinity, or "sticky sessions", for your roles. The following image shows the **Load Balancing** properties dialog used to enable the session affinity feature:

![][ic719492]

## To enable session affinity for your role ##

1. Right-click the role in Eclipse's Project Explorer, click **Azure**, and then click **Load Balancing**.
1. In the **Properties for WorkerRole1 Load Balancing** dialog:
    1. Check **Enable HTTP session affinity (sticky sessions) for this role.**
    1. For **Input endpoint to use**, select an input endpoint to use, for example, **http (public:80, private:8080)**. Your application must use this endpoint as its HTTP endpoint. You can enable multiple endpoints for your role, but you can select only one of them to support sticky sessions.
    1. Rebuild your application.

Once enabled, if you have more than one role instance, HTTP requests coming from a particular client will continue being handled by the same role instance.

The Eclipse Toolkit enables this by installing a special IIS module called Application Request Routing (ARR) into each of your role instances. ARR reroutes HTTP requests to the appropriate role instance. The toolkit automatically reconfigures the selected endpoint so that the incoming HTTP traffic is first routed to the ARR software. The toolkit also creates a new internal endpoint that your Java server is configured to listen to. That is the endpoint used by ARR to reroute the HTTP traffic to the appropriate role instance. This way, each role instance in your multi-instance deployment serves as a reverse proxy for all the other instances, enabling sticky sessions.

## Notes about session affinity ##

* Session affinity does not work in the compute emulator. The settings can be applied in the compute emulator without interfering with your build process or compute emulator execution, but the feature itself does not function within the compute emulator.
* Enabling session affinity will result in an increase in the amount of disk space taken up by your deployment in Azure, as additional software will be downloaded and installed into your role instances when your service is started in the Azure cloud.
* The time to initialize each role will take longer.
* An internal endpoint, to function as a traffic rerouter as mentioned above, will be added.

For an example of how to maintain session data when session affinity is enabled, see [How to Maintain Session Data with Session Affinity][].

## See Also ##

[Azure Toolkit for Eclipse][]

[Creating a Hello World Application for Azure in Eclipse][]

[Installing the Azure Toolkit for Eclipse][] 

[How to Maintain Session Data with Session Affinity][]

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[How to Maintain Session Data with Session Affinity]: http://go.microsoft.com/fwlink/?LinkID=699539
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546

<!-- IMG List -->

[ic719492]: ./media/azure-toolkit-for-eclipse-enable-session-affinity/ic719492.png
