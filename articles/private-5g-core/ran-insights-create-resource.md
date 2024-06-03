---
title: Create a radio access network insights resource
description: Learn how to set up your radio access network insights resource
author: delnas
ms.author: delnas
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 5/28/2024

---

# Create a radio access network insights resource 
Radio access network (RAN) insights allows you to connect and view your third party RAN metrics to your private mobile networks in Azure. RAN insights extends the RAN Element Management System (EMS) offered by the RAN vendor to include a Microsoft-compliant metrics agent that streams relevant RAN metrics to Azure. The streamed metrics are stored and presented in a secure and compliant manner, in adherence to Microsoft’s security standards and policies.

Each RAN insights resource is associated with one physical site resource and is composed of one or more access points, which represent the radio unit (nodeB) instance connected. In this how-to guide, you'll learn how to create a RAN insights resource in your private mobile network using Azure portal.


## Prerequisites
- Active deployment of Azure Private 5G Core(complete-private-mobile-network-prerequisites.md).
    - Check if the network is ready by verifying that a device / user equipment (UE) connected to the network through the RAN can transmit and receive data. If this doesn't work, fix any problems before trying to activate the RAN insights feature.  
- Deploy a compatible version of the RAN EMS from your RAN partner. You'll need to verify with your RAN partner that your RAN EMS contains a Microsoft-compatible External Metrics Agent (EMA) to send metrics to Azure. If not, your partner will need to install a metrics agent on the EMS you're using. Information on how and where to establish the connection between Azure and the EMS is specific to the RAN vendor, so contact them for details.  
-  Access to RAN insights for your Azure Subscription. Contact your Microsoft representative and ask them to register your Azure subscription for access to RAN insights. 
- Ensure you're registered with resource providers listed. Follow [Resource providers and resource types](https://learn.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types) for steps on how to register. 
    - Microsoft.insights  
    - Microsoft.NetworkAnalytics 
    - Microsoft.KeyVault  
    - Microsoft.ManagedIdentity 



## Create the RAN insights resource
1. Sign in to the Azure portal. 
1. Navigate to your site resource.
1. On the **Physical Infrastructure** page, select **Radio access network insights** and press create. 
    :::image type="content" source="media/ran-insights/ran-insights-create-resource-site.png" alt-text="Screenshot of the Azure portal showing creating a RAN insight resource on the site resource.":::
1. In the **Basics** configuration tab, fill in the needed information and select the checkbox to enable Metric Ingestion Endpoint (MIE), which processes RAN metrics streamed from the partner EMS and stores them in Azure Monitor. Note that your MIE instance is deployed in East US or West EU regardless of your subscription’s region. You'll have the option to enable the MIE later if you choose not to complete this step now. Then select **Next : Access Points >**.
    :::image type="content" source="media/ran-insights/ran-insights-basics-tab.png" alt-text="Screenshot of the Azure portal showing a RAN insight resource basics tab during creation.":::
1. In the **Access Points** section, you can enter the latitude and longitude coordinates of your access points. If access points are turned on and connected to your RAN EMS, the access point names will automatically populate once the RAN insights resource is set up.  
    :::image type="content" source="media/ran-insights/ran-insights-access-point-create-tab.png" alt-text="Screenshot of the Azure portal showing a RAN insight resource acesss point tab during creation.":::
1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. Once your configuration has been validated, you can select **Create** to create the RAN insights resource. The Azure portal will display the following confirmation screen when the RAN insights resource has been created.
    :::image type="content" source="media/ran-insights/ran-insights-deloyment-complete.png" alt-text="Screenshot of the Azure portal showing deployment is complete for RAN insight resource.":::
1. Select **Go to resource** to view your RAN insights resource. 


## Enable/Disable metrics ingestion endpoint (MIE) instance
If the MIE was not enabled during creation, the RAN **Overview** page under the **MIE details** tab shows a message stating that MIE was not enabled. 
    :::image type="content" source="media/ran-insights/ran-insights-mie-not-enabled.png" alt-text="Screenshot of the Azure portal showing a RAN insight resource MIE not enabled.":::
The MIE resource is automatically deleted from the service if it is "Disabled" from the online service portal or if you choose to delete the RAN insights resource. If you disable the MIE resource you'll still have access to your historical data for up to 30 days, but the RAN insights resource will stop reporting metrics. 

You can enable and disable your MIE under the Configuration blade: 
    :::image type="content" source="media/ran-insights/ran-insights-config-tab-mie.png" alt-text="Screenshot of the Azure portal showing a RAN insight resource MIE toggle enabled.":::



## View MIE details 
Once your RAN insights resource is configured and set up, you can view additional information in the **Overview** page under the **MIE details** tab. 
    :::image type="content" source="media/ran-insights/ran-insights-mie-details-tab.png" alt-text="Screenshot of the Azure portal showing a RAN insight resource MIE details.":::

This tab holds important details, such as:  
- MIE name – name of the MIE 
- MIE status – status of MIE, should be "Succeeded" 
- Eventhub url - URL for the event hub 
- Eventhub name – name of the event hub 
- Keyvault – URL for key vault containing connection string 

If you're unable to access the information in the MIE key vault URL then you may not have the correct credentials. If so, you need to take the necessary steps to grant access for the required role. Refer to [Azure RBAC documentation | Microsoft Learn](https://learn.microsoft.com/azure/role-based-access-control/) for steps on how to do this. 
    :::image type="content" source="media/ran-insights/ran-insights-key-vault-not-working.png" alt-text="Screenshot of the Azure portal showing operation not allowed for key vault.":::



## Delete a RAN insights resource
You can delete your RAN insights resource from the RAN insights resource or your site resource. 
To delete from your RAN insights resource: 
1. Navigate to your RAN insights resource.
1. On the **Overview** page, select **Delete**. 
    :::image type="content" source="media/ran-insights/ran-insights-delete-from-ran-resource.png" alt-text="Screenshot of the Azure portal showing deleting a RAN insight resource on the RAN insight resource.":::


To delete from your site resource:  
1. Navigate to your site resource.
1. On the **Physical Infrastructure** page, select **Radio access network insights**. 
1. Select the RAN insights resource you would like to delete, and press **Delete**.
    :::image type="content" source="media/ran-insights/ran-insights-delete-from-site-resource.png" alt-text="Screenshot of the Azure portal showing deleting a RAN insight resource on the site resource.":::


## Next steps
- [Monitor with RAN metrics](ran-insights-monitor-with-ran-metrics-concepts.md)
- [Monitor with geo maps](ran-insights-monitor-with-geo-maps-concepts.md)
- [Monitor with correlated metrics](ran-insights-monitor-with-correlated-metrics-concepts.md)
