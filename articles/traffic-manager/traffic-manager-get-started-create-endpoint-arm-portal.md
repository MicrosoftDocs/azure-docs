<properties 
   pageTitle="Create an endpoint for Traffic Manager using the preview portal in Resource Manager | Microsoft Azure"
   description="Learn how to create an endpoint for Traffic Manager using the preview portal in Resource Manager"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/20/2016"
   ms.author="joaoma" />

# Create an endpoint for Traffic Manager by using the Azure portal

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-arm-selectors-include.md](../../includes/traffic-manager-get-started-create-endpoint-arm-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-intro-arm-include.md](../../includes/traffic-manager-get-started-create-endpoint-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](traffic-manager-get-started-create-endpoint-classic-portal.md).

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-scenario-include.md](../../includes/traffic-manager-get-started-create-endpoint-scenario-include.md)]


## Add an endpoint by using the Azure portal 

To add endpoints to from the Azure portal, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.

1. On the left hand side, click on **browse** > **traffic manager profiles**> **all settings**> **endpoints**.

3. Click on **+Add** sign to display the "add endpoint" blade.
4. There are two types of endpoint options to add by the portal: Azure and External.

 ### To add an Azure endpoint

1. In the "add endpoint" page click on **Azure** type.
2. In **Name**, create a name for the endpoint.
3. In **resource group**, choose the resource group where the web app, public IP or classic cloud service exists. If you want to use a classic cloud service, the resource group will have the same name as the classic cloud service name.  
4. In **Target resource type**, choose between web app, public IP or cloud service.
5. In **Target resource**, choose the resource to be added as an endpoint.
6. click **ok** in the bottom of the "add endpoint" blade.

### To add an external endpoint

1. In the "add endpoint" page click on **External** type.
2. In **Name**, create a name for the endpoint.
4. In **Fully-qualified domain name (FQDN)**, type the FQDN for the external endpoint.
5. In **Location**, choose the region where the endpoint resource will be created.
6. click **ok** in the bottom of the "add endpoint" blade.

After following the above steps, the resource will be added to the list of endpoints available for traffic manager. A successful configuration will show the endpoint as "online" in the "endpoints" blade.




## Next steps

After configuring endpoints for your traffic manager profile, you have to [create a CNAME record to point your Internet domain to Traffic Manager](traffic-manager-point-internet-domain.md). This step will resolve your DNS record to your traffic manager resource. 
