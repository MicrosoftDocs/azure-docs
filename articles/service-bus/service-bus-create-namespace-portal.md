<properties
   pageTitle="Create a Service Bus namespace using the Azure portal | Microsoft Azure"
   description="In order to get started with Service Bus, you will need a namespace. Here's how to create one using the Azure portal."
   services="service-bus"
   documentationCenter=".net"
   authors="jtaubensee"
   manager="timlt"
   editor="sethmanheim"/>

<tags
   ms.service="service-bus"
   ms.devlang="tbd"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="dotnet"
   ms.workload="na"
   ms.date="05/24/2016"
   ms.author="jotaub@microsoft.com"/>

#Creating a Service Bus namespace using the Azure portal
The namespace, is a common container for all of your messaging components. Multiple queues and topics can reside in a single namespace, and namespaces often serve as application containers. There are currently 2 different ways to create a Service Bus namespaces.

1.	Azure portal (this article)

2.	[ARM Templates][create-namespace-using-arm]

##Creating a namespace in the Azure portal
1. Log on to the Azure classic portal.

2. In the left navigation pane of the portal, click **Service Bus**.

3. In the lower pane of the portal, click **Create**.

    ![Select Create][1]
   
4. In the **Add a new namespace** dialog, enter a namespace name. The system immediately checks to see if the name is available.

    ![Namespace name][2]
  
5. After making sure the namespace name is available, choose the country or region in which your namespace should be hosted.

6. Leave the other fields in the dialog with their default values (**Messaging** and **Standard Tier**), then click the OK check mark. The system now creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.
 
    ![Created successfully][3]

##Obtain the credentials
1. In the left navigation pane, click the **Service Bus** node, to display the list of available namespaces:
 
    ![Select service bus][4]
  
2. Select the namespace you just created from the list shown:
 
    ![Select namespace][5]
 
3. Click **Connection Information**.

    ![Connection information][6]
  
4. In the **Access connection information** pane, find the connection string that contains the SAS key and key name.

    ![Access connection information][7]
  
5. Make a note of the key, or copy it to the clipboard.

Congratulations! You have now created a Service Bus Namespace.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
##Next steps

Chckout our GitHub repository with samples that show off some of the more advanced features of Azure Service Bus Messaging.
[https://github.com/Azure-Samples/azure-servicebus-messaging-samples][github-samples]

<!--Image references-->

[1]: ./media/service-bus-create-namespace-portal/select-create.png
[2]: ./media/service-bus-create-namespace-portal/namespace-name.png
[3]: ./media/service-bus-create-namespace-portal/created-successfully.png
[4]: ./media/service-bus-create-namespace-portal/select-service-bus.png
[5]: ./media/service-bus-create-namespace-portal/select-namespace.png
[6]: ./media/service-bus-create-namespace-portal/connection-information.png
[7]: ./media/service-bus-create-namespace-portal/access-connection-information.png


<!--Reference style links - using these makes the source content way more readable than using inline links-->
[classic-portal]: https://manage.windowsazure.com
[github-samples]: https://github.com/Azure-Samples/azure-servicebus-messaging-samples
[create-namespace-using-arm]: ./service-bus-resource-manager-overview.md