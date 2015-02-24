<properties 
	pageTitle="Learn about flow apps" 
	description="Learn about flow apps" 
	authors="stepsic-microsoft-com" 
	manager="cshankar" 
	editor="" 
	services="app-service" 
	documentationCenter=""/>



<tags
	ms.service="app-service"
	ms.workload="web"
	ms.tgt_pltfrm=""
	ms.devlang=""
	ms.topic=""
	ms.date="2/24/2015"
	ms.author="stepsic-microsoft-com"/>



# Connectivity across SaaS and Enterprise

Integrate a single application that uses any number of connector to public SaaS services or your own custom backed. There are already 40 + connectors published by Microsoft, from Facebook and Twitter to SQL to AS2 and EDIFACT. You don't need to know how the Facebook API works, because the connectors describe exactly what they need to be used, from what Authentication needs to be provided to the set of actions and parameters they support. 

Out of the box connectors based on the API app framework provide connectivity to a wide range of SaaS services and on-premise servers. Connecting a business process to a data source or destination works the same way a web or mobile app leveraging App Services would connect, thus providing a consistent and easy to learn experience for developers, and allowing a wider set of developers to contribute to building integration applications. Further, these are a part of the marketplace, which makes it easy for third party developers to enrich the available connectors, or for enterprises to build custom connectors to their LoB systems.

# Easy to use design tools

You can design flows end-to-end right in your browser. You can start with any trigger, from a simple schedule to whenever a tweet appears about your company. Then, you can orchestrate any number of actions that use connectors. The designer makes it easy to construct even complex flows that fork an loop over data. By being entirely browser-based, you can make the flows on whatever device, from Desktop to Tablet, your users are comfortable with. 

![Flow app designer](./media/app-service-learn-about-flows-preview/Designer.png)

# Rich out of box functionality 

You can get started in just minutes by connecting one or more services. We support :
- A rich workflow experience - App Services provides Flows, which is a powerful cloud based engine for orchestrating API apps. It provides the ability to implement a wide range of workflows, ranging from simple message processing between two data sources, to orchestrating typical business processes like creating travel bookings, on-boarding a new employee etc. The inbuilt capabilities to perform conditional execution based on previous outputs and success/failure make it easy to develop complex flows that involve processing batches and error handling. 
- Rules engine - The business rules engine provides a way for Business Analysts to create and maintain business policies. These policies are maintained independent of the business process, making it easy to update the policy per business requirements as and when needed, even if the overall process doesn’t change. 
- JSON/XML transformation- Out of the box API apps provide the ability to handle XML data easily with validation, transformation and extract operations which can be used to enforce contract between your XML based LoB apps and transform data to suit the needs of a particular data source. Further, JSON objects are natively recognized by the underlying flow engine and can be processed by the flow itself. 
- Trading partner management - : App Services provides out of the box capability to create and manage trading partners, receive/send messages and process B2B data, and then connect back to your enterprise, all in a single business process (flow). Hosting B2B connectivity in the cloud provides a simpler and more manageable solution than hosting extranet servers and managing their security in-house. With inbuilt capabilities to parse X12 and EDIFACT messages, handling batches and sending/processing acknowledgements you can easily integrate B2B messages into an e2e business process to automate the handling of your B2B transactions.

#Extensibility and eco-system 

The foundation of API apps for building the individual pieces means that both additional connectivity and functionality pieces for data processing can be developed by anyone and deployed to the platform for use in an end to end business process. These pieces could be developed by both third party developers and made available in a marketplace, or by enterprises to suit their own specific needs. There will be hundreds of third-party connectors and services to extend the platform.
