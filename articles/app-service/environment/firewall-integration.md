---
title: Lock down outbound traffic
description: Learn how to integrate with Azure Firewall to secure outbound traffic from within an App Service Environment.
author: madsd
ms.assetid: 955a4d84-94ca-418d-aa79-b57a5eb8cb85
ms.topic: article
ms.date: 11/20/2023
ms.author: madsd
ms.custom: seodec18, references_regions

---

# Locking down an App Service Environment

> [!IMPORTANT]
> This article is about App Service Environment v2 which is used with Isolated App Service plans. [App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024-2/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v2, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.

As of 15 January 2024, you can no longer create new App Service Environment v2 resources using any of the available methods including ARM/Bicep templates, Azure Portal, Azure CLI, or REST API. You must [migrate to App Service Environment v3](upgrade-to-asev3.md) before 31 August 2024 to prevent resource deletion and data loss.
>

The App Service Environment (ASE) has many external dependencies that it requires access to in order to function properly. The ASE lives in the customer Azure Virtual Network. Customers must allow the ASE dependency traffic, which is a problem for customers that want to lock down all egress from their virtual network.

There are many inbound endpoints that are used to manage an ASE. The inbound management traffic can't be sent through a firewall device. The source addresses for this traffic are known and are published in the [App Service Environment management addresses](./management-addresses.md) document. There's also a Service Tag named AppServiceManagement, which can be used with Network Security Groups (NSGs) to secure inbound traffic.

The ASE outbound dependencies are almost entirely defined with FQDNs, which don't have static addresses behind them. The lack of static addresses means that Network Security Groups can't be used to lock down the outbound traffic from an ASE. The addresses change often enough that one can't set up rules based on the current resolution and use that to create NSGs.

The solution to securing outbound addresses lies in use of a firewall device that can control outbound traffic based on domain names. Azure Firewall can restrict outbound HTTP and HTTPS traffic based on the FQDN of the destination.  

## System architecture

Deploying an ASE with outbound traffic going through a firewall device requires changing routes on the ASE subnet. Routes operate at an IP level. If you aren't careful in defining your routes, you can force TCP reply traffic to source from another address. When your reply address is different from the address traffic was sent to, the problem is called asymmetric routing and it breaks TCP.

There must be routes defined so that inbound traffic to the ASE can reply back the same way the traffic came in. Routes must be defined for inbound management requests and for inbound application requests.

The traffic to and from an ASE must abide by the following conventions

- The traffic to Azure SQL, Storage, and Event Hubs aren't supported with use of a firewall device. This traffic must be sent directly to those services. The way to make that happen is to configure service endpoints for those three services.
- Route table rules must be defined that send inbound management traffic back from where it came.
- Route table rules must be defined that send inbound application traffic back from where it came.
- All other traffic leaving the ASE can be sent to your firewall device with a route table rule.

![ASE with Azure Firewall connection flow][5]

## Locking down inbound management traffic

If your ASE subnet doesn't already have an NSG assigned to it, create one. Within the NSG, set the first rule to allow traffic from the Service Tag named AppServiceManagement on ports 454, 455. The rule to allow access from the AppServiceManagement tag is the only thing that is required from public IPs to manage your ASE. The addresses that are behind that Service Tag are only used to administer the Azure App Service. The management traffic that flows through these connections is encrypted and secured with authentication certificates. Typical traffic on this channel includes things like customer initiated commands and health probes.

ASEs that are made through the portal with a new subnet are made with an NSG that contains the allow rule for the AppServiceManagement tag.  

Your ASE must also allow inbound requests from the Load Balancer tag on port 16001. The requests from the Load Balancer on port 16001 are keep alive checks between the Load Balancer and the ASE front ends. If port 16001 is blocked, your ASE goes unhealthy.

## Configuring Azure Firewall with your ASE

The steps to lock down egress from your existing ASE with Azure Firewall are:

1. Enable service endpoints to SQL, Storage, and Event Hubs on your ASE subnet. To enable service endpoints, go into the networking portal > subnets and select Microsoft.EventHub, Microsoft.SQL and Microsoft.Storage from the Service endpoints dropdown. When you have service endpoints enabled to Azure SQL, any Azure SQL dependencies that your apps have must be configured with service endpoints as well.

   ![select service endpoints][2]

1. Create a subnet named AzureFirewallSubnet in the virtual network where your ASE exists. Follow the directions in the [Azure Firewall documentation](../../firewall/index.yml) to create your Azure Firewall.

1. From the Azure Firewall UI > Rules > Application rule collection, select Add application rule collection. Provide a name, priority, and set Allow. In the FQDN tags section, provide a name, set the source addresses to * and select the App Service Environment FQDN Tag and the Windows Update.

   ![Add application rule][1]

1. From the Azure Firewall UI > Rules > Network rule collection, select Add network rule collection. Provide a name, priority, and set Allow. In the Rules section under IP addresses, provide a name, select a protocol of **Any**, set * to Source and Destination addresses, and set the ports to 123. This rule allows the system to perform clock sync using NTP. Create another rule the same way to port 12000 to help triage any system issues.

   ![Add NTP network rule][3]

1. From the Azure Firewall UI > Rules > Network rule collection, select Add network rule collection. Provide a name, priority, and set Allow. In the Rules section under Service Tags, provide a name, select a protocol of **Any**, set * to Source addresses, select a service tag of AzureMonitor, and set the ports to 80, 443. This rule allows the system to supply Azure Monitor with health and metrics information.

   ![Add NTP service tag network rule][6]

1. Create a route table with a route for the AppServiceManagement service tag with a next hop of Internet. This route table entry is required to avoid asymmetric routing problems. Add a Virtual Appliance route to your route table for 0.0.0.0/0 with the next hop being your Azure Firewall private IP address. You should use the service tag instead of the IP addresses to avoid having to update the route table when the management addresses change. However, if you need to use the management addresses, you can download the service tag reference file for the cloud you're using from [App Service Environment management addresses](./management-addresses.md) and create your routes from those.

1. Assign the route table you created to your ASE subnet.

### Deploying your ASE behind a firewall

The steps to deploy your ASE behind a firewall are the same as configuring your existing ASE with an Azure Firewall except you need to create your ASE subnet and then follow the previous steps. To create your ASE in a pre-existing subnet, you need to use a Resource Manager template as described in the document on [Creating your ASE with a Resource Manager template](./create-from-template.md).

### Application traffic

The above steps allow your ASE to operate without problems. You still need to configure things to accommodate your application needs. There are two problems for applications in an ASE that is configured with Azure Firewall.  

- Application dependencies must be added to the Azure Firewall or the route table.
- Routes must be created for the application traffic to avoid asymmetric routing issues

If your applications have dependencies, they need to be added to your Azure Firewall. Create Application rules to allow HTTP/HTTPS traffic and Network rules for everything else.

When you know the address range that your application request traffic comes from, you can add that to the route table that is assigned to your ASE subnet. If the address range is large or unspecified, then you can use a network appliance like the Application Gateway to give you one address to add to your route table. For details on configuring an Application Gateway with your ILB ASE, read [Integrating your ILB ASE with an Application Gateway](./integrate-with-application-gateway.md)

This use of the Application Gateway is just one example of how to configure your system. If you did follow this path, then you would need to add a route to the ASE subnet route table so the reply traffic sent to the Application Gateway would go there directly.

### Logging

Azure Firewall can send logs to Azure Storage, Event Hubs, or Azure Monitor logs. To integrate your app with any supported destination, go to the Azure Firewall portal > Diagnostic Logs and enable the logs for your desired destination. If you integrate with Azure Monitor logs, then you can see logging for any traffic sent to Azure Firewall. To see the traffic that is being denied, open your Log Analytics workspace portal > Logs and enter a query like

```kusto
AzureDiagnostics | where msg_s contains "Deny" | where TimeGenerated >= ago(1h)
```

Integrating your Azure Firewall with Azure Monitor logs is useful when first getting an application working when you aren't aware of all of the application dependencies. You can learn more about Azure Monitor logs from [Analyze log data in Azure Monitor](../../azure-monitor/logs/log-query-overview.md).

<a name="dependencies"></a>
## Configuring third-party firewall with your ASE

The following information is only required if you wish to configure a firewall appliance other than Azure Firewall. For Azure Firewall see [the section above](#configuring-azure-firewall-with-your-ase).

Consider the following dependencies when deploying a third-party firewall with your ASE:

- Service Endpoint capable services should be configured with service endpoints.
- IP Address dependencies are for non-HTTP/S traffic (both TCP and UDP traffic)
- FQDN HTTP/HTTPS endpoints can be placed in your firewall device.
- Wildcard HTTP/HTTPS endpoints are dependencies that can vary with your ASE based on many qualifiers.
- Linux dependencies are only a concern if you're deploying Linux apps into your ASE. If you aren't deploying Linux apps into your ASE, then these addresses don't need to be added to your firewall.

### Service Endpoint capable dependencies

| Endpoint |
|----------|
| Azure SQL |
| Azure Storage |
| Azure Event Hubs |

### IP Address dependencies

| Endpoint | Details |
|----------| ----- |
| \*:123 | NTP clock check. Traffic is checked at multiple endpoints on port 123 |
| \*:12000 | This port is used for some system monitoring. If blocked, then some issues are harder to triage but your ASE continues to operate |
| 40.77.24.27:80 | Needed to monitor and alert on ASE problems |
| 40.77.24.27:443 | Needed to monitor and alert on ASE problems |
| 13.90.249.229:80 | Needed to monitor and alert on ASE problems |
| 13.90.249.229:443 | Needed to monitor and alert on ASE problems |
| 104.45.230.69:80 | Needed to monitor and alert on ASE problems |
| 104.45.230.69:443 | Needed to monitor and alert on ASE problems |
| 13.82.184.151:80 | Needed to monitor and alert on ASE problems |
| 13.82.184.151:443 | Needed to monitor and alert on ASE problems |

With an Azure Firewall, you automatically get the following configured with the FQDN tags.

### FQDN HTTP/HTTPS dependencies

| Endpoint |
|----------|
|graph.microsoft.com:443 |
|login.live.com:443 |
|login.windows.com:443 |
|login.windows.net:443 |
|login.microsoftonline.com:443 |
|\*.login.microsoftonline.com:443|
|\*.login.microsoft.com:443|
|client.wns.windows.com:443 |
|definitionupdates.microsoft.com:443 |
|go.microsoft.com:80 |
|go.microsoft.com:443 |
|www.microsoft.com:80 |
|www.microsoft.com:443 |
|wdcpalt.microsoft.com:443 |
|wdcp.microsoft.com:443 |
|ocsp.msocsp.com:443 |
|ocsp.msocsp.com:80 |
|oneocsp.microsoft.com:80 |
|oneocsp.microsoft.com:443 |
|mscrl.microsoft.com:443 |
|mscrl.microsoft.com:80 |
|crl.microsoft.com:443 |
|crl.microsoft.com:80 |
|www.thawte.com:443 |
|crl3.digicert.com:80 |
|ocsp.digicert.com:80 |
|ocsp.digicert.com:443 |
|csc3-2009-2.crl.verisign.com:80 |
|crl.verisign.com:80 |
|ocsp.verisign.com:80 |
|cacerts.digicert.com:80 |
|azperfcounters1.blob.core.windows.net:443 |
|azurewatsonanalysis-prod.core.windows.net:443 |
|global.metrics.nsatc.net:80 |
|global.metrics.nsatc.net:443 |
|az-prod.metrics.nsatc.net:443 |
|antares.metrics.nsatc.net:443 |
|azglobal-black.azglobal.metrics.nsatc.net:443 |
|azglobal-red.azglobal.metrics.nsatc.net:443 |
|antares-black.antares.metrics.nsatc.net:443 |
|antares-red.antares.metrics.nsatc.net:443 |
|prod.microsoftmetrics.com:443 |
|maupdateaccount.blob.core.windows.net:443 |
|clientconfig.passport.net:443 |
|packages.microsoft.com:443 |
|schemas.microsoft.com:80 |
|schemas.microsoft.com:443 |
|management.core.windows.net:443 |
|management.core.windows.net:80 |
|management.azure.com:443 |
|www.msftconnecttest.com:80 |
|shavamanifestcdnprod1.azureedge.net:443 |
|validation-v2.sls.microsoft.com:443 |
|flighting.cp.wd.microsoft.com:443 |
|dmd.metaservices.microsoft.com:80 |
|admin.core.windows.net:443 |
|prod.warmpath.msftcloudes.com:443 |
|prod.warmpath.msftcloudes.com:80 |
|gcs.prod.monitoring.core.windows.net:80|
|gcs.prod.monitoring.core.windows.net:443|
|azureprofileruploads.blob.core.windows.net:443 |
|azureprofileruploads2.blob.core.windows.net:443 |
|azureprofileruploads3.blob.core.windows.net:443 |
|azureprofileruploads4.blob.core.windows.net:443 |
|azureprofileruploads5.blob.core.windows.net:443 |
|azperfmerges.blob.core.windows.net:443 |
|azprofileruploads1.blob.core.windows.net:443 |
|azprofileruploads10.blob.core.windows.net:443 |
|azprofileruploads2.blob.core.windows.net:443 |
|azprofileruploads3.blob.core.windows.net:443 |
|azprofileruploads4.blob.core.windows.net:443 |
|azprofileruploads6.blob.core.windows.net:443 |
|azprofileruploads7.blob.core.windows.net:443 |
|azprofileruploads8.blob.core.windows.net:443 |
|azprofileruploads9.blob.core.windows.net:443 |
|azureprofilerfrontdoor.cloudapp.net:443 |
|settings-win.data.microsoft.com:443 |
|maupdateaccount2.blob.core.windows.net:443 |
|maupdateaccount3.blob.core.windows.net:443 |
|dc.services.visualstudio.com:443 |
|gmstorageprodsn1.blob.core.windows.net:443 |
|gmstorageprodsn1.file.core.windows.net:443 |
|gmstorageprodsn1.queue.core.windows.net:443 |
|gmstorageprodsn1.table.core.windows.net:443 |
|rteventservice.trafficmanager.net:443 |
|ctldl.windowsupdate.com:80 |
|ctldl.windowsupdate.com:443 |
|global-dsms.dsms.core.windows.net:443 |

### Wildcard HTTP/HTTPS dependencies

| Endpoint |
|----------|
|gr-prod-\*.cloudapp.net:443 |
|gr-prod-\*.azurewebsites.windows.net:443 |
| \*.management.azure.com:443 |
| \*.update.microsoft.com:443 |
| \*.windowsupdate.microsoft.com:443 |
| \*.identity.azure.net:443 |
| \*.ctldl.windowsupdate.com:80 |
| \*.ctldl.windowsupdate.com:443 |
| \*.prod.microsoftmetrics.com:443 |
| \*.dsms.core.windows.net:443 |
| \*.prod.warm.ingest.monitor.core.windows.net:443 |

### Linux dependencies

| Endpoint |
|----------|
|wawsinfraprodbay063.blob.core.windows.net:443 |
|registry-1.docker.io:443 |
|auth.docker.io:443 |
|production.cloudflare.docker.com:443 |
|download.docker.com:443 |
|us.archive.ubuntu.com:80 |
|download.mono-project.com:80 |
|packages.treasuredata.com:80|
|security.ubuntu.com:80 |
|oryx-cdn.microsoft.io:443 |
| \*.cdn.mscr.io:443 |
| \*.data.mcr.microsoft.com:443 |
|mcr.microsoft.com:443 |
|\*.data.mcr.microsoft.com:443 |
|packages.fluentbit.io:80 |
|packages.fluentbit.io:443 |
|apt-mo.trafficmanager.net:80 |
|apt-mo.trafficmanager.net:443 |
|azure.archive.ubuntu.com:80 |
|azure.archive.ubuntu.com:443 |
|changelogs.ubuntu.com:80 |
|13.74.252.37:11371 |
|13.75.127.55:11371 |
|13.76.190.189:11371 |
|13.80.10.205:11371 |
|13.91.48.226:11371 |
|40.76.35.62:11371 |
|104.215.95.108:11371 |

## Configuring a firewall with ASE in US Gov regions

For ASEs in US Gov regions, follow the instructions in the [Configuring Azure Firewall with your ASE](#configuring-azure-firewall-with-your-ase) section of this document to configure an Azure Firewall with your ASE.

When you want to use a third-party firewall in US Gov, you need to consider the following dependencies:

- Service Endpoint capable services should be configured with service endpoints.
- FQDN HTTP/HTTPS endpoints can be placed in your firewall device.
- Wildcard HTTP/HTTPS endpoints are dependencies that can vary with your ASE based on many qualifiers.

Linux isn't available in US Gov regions and is thus not listed as an optional configuration.

### Service Endpoint capable dependencies

| Endpoint |
|----------|
| Azure SQL |
| Azure Storage |
| Azure Event Hubs |

### IP Address dependencies

| Endpoint | Details |
|----------| ----- |
| \*:123 | NTP clock check. Traffic is checked at multiple endpoints on port 123 |
| \*:12000 | This port is used for some system monitoring. If blocked, then some issues are harder to triage but your ASE continues to operate |
| 40.77.24.27:80 | Needed to monitor and alert on ASE problems |
| 40.77.24.27:443 | Needed to monitor and alert on ASE problems |
| 13.90.249.229:80 | Needed to monitor and alert on ASE problems |
| 13.90.249.229:443 | Needed to monitor and alert on ASE problems |
| 104.45.230.69:80 | Needed to monitor and alert on ASE problems |
| 104.45.230.69:443 | Needed to monitor and alert on ASE problems |
| 13.82.184.151:80 | Needed to monitor and alert on ASE problems |
| 13.82.184.151:443 | Needed to monitor and alert on ASE problems |

### FQDN HTTP/HTTPS dependencies

| Endpoint |
|----------|
|admin.core.usgovcloudapi.net:80 |
|azperfmerges.blob.core.windows.net:80 |
|azperfmerges.blob.core.windows.net:80 |
|azprofileruploads1.blob.core.windows.net:80 |
|azprofileruploads10.blob.core.windows.net:80 |
|azprofileruploads2.blob.core.windows.net:80 |
|azprofileruploads3.blob.core.windows.net:80 |
|azprofileruploads4.blob.core.windows.net:80 |
|azprofileruploads5.blob.core.windows.net:80 |
|azprofileruploads6.blob.core.windows.net:80 |
|azprofileruploads7.blob.core.windows.net:80 |
|azprofileruploads8.blob.core.windows.net:80 |
|azprofileruploads9.blob.core.windows.net:80 |
|azureprofilerfrontdoor.cloudapp.net:80 |
|azurewatsonanalysis.usgovcloudapp.net:80 |
|cacerts.digicert.com:80 |
|client.wns.windows.com:80 |
|crl.microsoft.com:80 |
|crl.verisign.com:80 |
|crl3.digicert.com:80 |
|csc3-2009-2.crl.verisign.com:80 |
|ctldl.windowsupdate.com:80 |
|definitionupdates.microsoft.com:80 |
|download.windowsupdate.com:80 |
|fairfax.warmpath.usgovcloudapi.net:80 |
|flighting.cp.wd.microsoft.com:80 |
|gcwsprodgmdm2billing.queue.core.usgovcloudapi.net:80 |
|gcwsprodgmdm2billing.table.core.usgovcloudapi.net:80 |
|global.metrics.nsatc.net:80 |
|go.microsoft.com:80 |
|gr-gcws-prod-bd3.usgovcloudapp.net:80 |
|gr-gcws-prod-bn1.usgovcloudapp.net:80 |
|gr-gcws-prod-dd3.usgovcloudapp.net:80 |
|gr-gcws-prod-dm2.usgovcloudapp.net:80 |
|gr-gcws-prod-phx20.usgovcloudapp.net:80 |
|gr-gcws-prod-sn5.usgovcloudapp.net:80 |
|login.live.com:80 |
|login.microsoftonline.us:80 |
|management.core.usgovcloudapi.net:80 |
|management.usgovcloudapi.net:80 |
|maupdateaccountff.blob.core.usgovcloudapi.net:80 |
|mscrl.microsoft.com:80
|ocsp.digicert.com:80 |
|ocsp.verisign.com:80 |
|rteventse.trafficmanager.net:80 |
|settings-n.data.microsoft.com:80 |
|shavamafestcdnprod1.azureedge.net:80 |
|shavanifestcdnprod1.azureedge.net:80 |
|v10ortex-win.data.microsoft.com:80 |
|wp.microsoft.com:80 |
|dcpalt.microsoft.com:80 |
|www.microsoft.com:80 |
|www.msftconnecttest.com:80 |
|www.thawte.com:80 |
|admin.core.usgovcloudapi.net:443 |
|azperfmerges.blob.core.windows.net:443 |
|azperfmerges.blob.core.windows.net:443 |
|azprofileruploads1.blob.core.windows.net:443 |
|azprofileruploads10.blob.core.windows.net:443 |
|azprofileruploads2.blob.core.windows.net:443 |
|azprofileruploads3.blob.core.windows.net:443 |
|azprofileruploads4.blob.core.windows.net:443 |
|azprofileruploads5.blob.core.windows.net:443 |
|azprofileruploads6.blob.core.windows.net:443 |
|azprofileruploads7.blob.core.windows.net:443 |
|azprofileruploads8.blob.core.windows.net:443 |
|azprofileruploads9.blob.core.windows.net:443 |
|azureprofilerfrontdoor.cloudapp.net:443 |
|azurewatsonanalysis.usgovcloudapp.net:443 |
|cacerts.digicert.com:443 |
|client.wns.windows.com:443 |
|crl.microsoft.com:443 |
|crl.verisign.com:443 |
|crl3.digicert.com:443 |
|csc3-2009-2.crl.verisign.com:443 |
|ctldl.windowsupdate.com:443 |
|definitionupdates.microsoft.com:443 |
|download.windowsupdate.com:443 |
|fairfax.warmpath.usgovcloudapi.net:443 |
|gcs.monitoring.core.usgovcloudapi.net:443 |
|flighting.cp.wd.microsoft.com:443 |
|gcwsprodgmdm2billing.queue.core.usgovcloudapi.net:443 |
|gcwsprodgmdm2billing.table.core.usgovcloudapi.net:443 |
|global.metrics.nsatc.net:443 |
|prod.microsoftmetrics.com:443 |
|go.microsoft.com:443 |
|gr-gcws-prod-bd3.usgovcloudapp.net:443 |
|gr-gcws-prod-bn1.usgovcloudapp.net:443 |
|gr-gcws-prod-dd3.usgovcloudapp.net:443 |
|gr-gcws-prod-dm2.usgovcloudapp.net:443 |
|gr-gcws-prod-phx20.usgovcloudapp.net:443 |
|gr-gcws-prod-sn5.usgovcloudapp.net:443 |
|login.live.com:443 |
|login.microsoftonline.us:443 |
|management.core.usgovcloudapi.net:443 |
|management.usgovcloudapi.net:443 |
|maupdateaccountff.blob.core.usgovcloudapi.net:443 |
|mscrl.microsoft.com:443 |
|ocsp.digicert.com:443 |
|ocsp.msocsp.com:443 |
|ocsp.msocsp.com:80 |
|oneocsp.microsoft.com:80 |
|oneocsp.microsoft.com:443 |
|ocsp.verisign.com:443 |
|rteventservice.trafficmanager.net:443 |
|settings-win.data.microsoft.com:443 |
|shavamanifestcdnprod1.azureedge.net:443 |
|shavamanifestcdnprod1.azureedge.net:443 |
|v10.vortex-win.data.microsoft.com:443 |
|wdcp.microsoft.com:443 |
|wdcpalt.microsoft.com:443 |
|www.microsoft.com:443 |
|www.msftconnecttest.com:443 |
|www.thawte.com:443 |
|global-dsms.dsms.core.usgovcloudapi.net:443 |

### Wildcard HTTP/HTTPS dependencies

| Endpoint |
|----------|
|\*.ctldl.windowsupdate.com:80 |
|\*.management.usgovcloudapi.net:80 |
|\*.update.microsoft.com:80 |
|\*ctldl.windowsupdate.com:443 |
|\*.management.usgovcloudapi.net:443 |
|\*.update.microsoft.com:443 |
|\*.prod.microsoftmetrics.com:443 |
| \*.prod.warm.ingest.monitor.core.usgovcloudapi.net:443 |

<!--Image references-->
[1]: ./media/firewall-integration/firewall-apprule.png
[2]: ./media/firewall-integration/firewall-serviceendpoints.png
[3]: ./media/firewall-integration/firewall-ntprule.png
[5]: ./media/firewall-integration/firewall-topology.png
[6]: ./media/firewall-integration/firewall-ntprule-monitor.png