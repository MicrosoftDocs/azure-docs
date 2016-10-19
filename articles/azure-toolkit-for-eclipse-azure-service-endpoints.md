<properties
    pageTitle="Azure Service Endpoints"
    description="Describes the Azure Service Endpoint settings in the Azure Toolkit for Eclipse."
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

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/dn268600.aspx -->

# Azure Service Endpoints #

Azure service endpoints determine whether your application is deployed to and managed by the global Azure platform, Azure operated by 21Vianet in China, or a private Azure platform. The **Service Endpoints** dialog allows you to specify which service endpoints you want to use. To open the **Service Endpoints** dialog, within Eclipse, click **Window**, click **Preferences**, expand **Azure**, and then click **Service Endpoints**. Setting the **Active Set** field determines which Azure service endpoints will be used for the Azure projects in your current workspace.

The following shows the **Service Endpoints** dialog.

![][ic719493]

## To set the service endpoints ##

In the **Service Endpoints** dialog, take one of the following actions:

* If you want to use the global Azure platform, from the **Active Set** dropdown list, select **windowsazure.com** and click **OK**.
* If you want to use Azure operated by 21Vianet in China, from the **Active Set** dropdown list, select **windowsazure.cn (China)** and click **OK**.
* If you want to use a private Azure platform:
    1. Click **Edit**.
    2. A dialog box opens, informing you that the **Service Endpoints** dialog will be closed, and the preference sets file will be opened. Click **OK**.
    3. In the preferencesets.xml file, create a new `preferenceset` element. For this new element, create `name`, `blob`, `management`, `portalURL` and `publishsettings` attributes, and add values for them that correspond to your private Azure platform. You can use the values provided for the existing `preferenceset` elements as templates. **Note**: The value used for the `blob` attribute must contain the text "blob" in the URL.
    4. Save and close preferencesets.xml.
    5. Reopen the **Service Endpoints** dialog.
    6. From the **Active Set** dropdown list, select the active set that you created and click **OK**.
    7. Once you've created your private Azure platform `preferenceset` element, you can change the values assigned to it by clicking the **Edit** button in the **Services Endpoint** dialog. You can also create multiple private Azure platform `preferenceset` elements, if you desire.

## See Also ##

[Azure Toolkit for Eclipse][]

[Installing the Azure Toolkit for Eclipse][] 

[Creating a Hello World Application for Azure in Eclipse][]

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546

<!-- IMG List -->

[ic719493]: ./media/azure-toolkit-for-eclipse-azure-service-endpoints/ic719493.png
