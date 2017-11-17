---
title: Azure Government image gallery | Microsoft Docs
description: This article provides an overview of the Azure Government image gallery and the images included
services: azure-government
cloud: gov
documentationcenter: ''
author: sarahwel
manager: pathuff

ms.assetid: f6dd4386-7b79-448a-8ae3-409258cc257b
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 05/12/2017
ms.author: saweld

---
# Azure Government Marketplace images

The Azure Government Marketplace provides a similar experience as the public Azure portal. You can choose to deploy prebuilt images from Microsoft and our partners, or upload your own VHDs. This gives you the flexibility to deploy your own standardized images if needed.

The following table shows a list of available images within the Azure Government Marketplace.  Some of the prebuilt images include pay-as-you-go licensing for specific software. Work with your Microsoft account team or reseller for Azure Government-specific pricing. For more information, see [Virtual machine pricing](http://azure.microsoft.com/pricing/details/virtual-machines/).

## Images
The list of virtual machine images available in Azure Government can be obtained by [connecting to Azure Government via PowerShell](documentation-government-get-started-connect-with-ps.md) and running the following commands:

```powershell
Login-AzureRMAccount -Environment AzureUSGovernment

Get-AzureRmVMImagePublisher -Location USGovVirginia | `
Get-AzureRmVMImageOffer | `
Get-AzureRmVMImageSku
```
<!-- 
Get-AzureRmVMImagePublisher -Location USGovVirginia | `
Get-AzureRmVMImageOffer | `
Get-AzureRmVMImageSku | `
Select-Object @{Name="Entry";Expression={"| " + $_.PublisherName + " | " + $_.Offer +  " | " + $_.Skus + " |" }} | `
Select-Object -ExpandProperty Entry | `
Out-File vm-images.md
-->

The table below contains a snapshot of the list of virtual machine images available in Azure Government via Resource Manager as of October 10, 2017.

|Publisher|Offer|SKU|
| --- | --- | --- |
| a10networks | a10-vthunder-adc | vthunder_410_byol |
| a10networks | a10-vthunder-adc | vthunder_byol |
| ACEPublishing | f5-big-ip | f5-bigip-virtual-edition-best-byol |
| akumina | akumina-interchange | akam101 |
| alertlogic | alert-logic-tm | 20215000100-tmpbyol |
| altamira-corporation | lumify | lumify |
| barracudanetworks | barracuda-app-sec-control-center | byol |
| barracudanetworks | barracuda-email-security-gateway | byol |
| barracudanetworks | barracuda-message-archiver | byol |
| barracudanetworks | barracuda-ng-cc | byol |
| barracudanetworks | barracuda-ng-firewall | byol |
| barracudanetworks | barracuda-spam-firewall | byol |
| barracudanetworks | waf | byol |
| beyondtrust | beyondinsight | uvm-azm |
| bitnami | abantecart | 1-2 |
| bitnami | activemq | 5-13 |
| bitnami | activemq | default |
| bitnami | akeneo | 1-4 |
| bitnami | alfrescocommunity | 201602 |
| bitnami | ametys | 3-7 |
| bitnami | apachesolr | 5-5 |
| bitnami | artifactory | 4-5 |
| bitnami | canvaslms | 2016-02 |
| bitnami | cassandra | 3-7 |
| bitnami | cassandra | cassandra |
| bitnami | cassandra | default |
| bitnami | chyrp | 2-5 |
| bitnami | civicrm | 4-7 |
| bitnami | cmsmadesimple | 2-1 |
| bitnami | codedx | 2-3 |
| bitnami | codiad | 2-7 |
| bitnami | concrete5 | 5-7 |
| bitnami | coppermine | 1-5 |
| bitnami | couchdb | 1-6 |
| bitnami | couchdb | couchdb |
| bitnami | diaspora | 0-5 |
| bitnami | discourse | 1-4 |
| bitnami | djangostack | 1-8 |
| bitnami | dokuwiki | 20150810a |
| bitnami | dolibarr | 3-8 |
| bitnami | dreamfactory | 2-1 |
| bitnami | drupal | 8-0 |
| bitnami | eclipseche | 4-4 |
| bitnami | elastic-search | 2-2 |
| bitnami | elk | 4-6 |
| bitnami | erpnext | 6-21 |
| bitnami | espocrm | 3-9 |
| bitnami | exoplatform | 4 |
| bitnami | exoplatformenterprise | 4-2 |
| bitnami | ezpublish | 2014-11 |
| bitnami | fatfreecrm | 0-13 |
| bitnami | ghost | 0-7 |
| bitnami | gitlab | 8-5 |
| bitnami | hadoop | 2-7 |
| bitnami | hadoop | default |
| bitnami | hhvmstack | 3-9 |
| bitnami | hordegroupwarewebmail | 5-2 |
| bitnami | jasperreports | 6-2 |
| bitnami | jbossas | 7-2 |
| bitnami | jenkins | 1-650 |
| bitnami | joomla | 3-5 |
| bitnami | jrubystack | 9-0 |
| bitnami | kafka | 0-1 |
| bitnami | kafka | default |
| bitnami | kafka | kafka |
| bitnami | lampstack | 5-6 |
| bitnami | lappstack | 5-6 |
| bitnami | letschat | 0-4 |
| bitnami | liferay | 6-2 |
| bitnami | limesurvey | 20160228 |
| bitnami | livehelperchat | 2-44v |
| bitnami | magento | 2-0 |
| bitnami | mahara | 15-10 |
| bitnami | mantis | 1-2 |
| bitnami | mariadb | default |
| bitnami | mariadb | mariadb |
| bitnami | mattermost | 3-6 |
| bitnami | mautic | 1-2 |
| bitnami | mean | 3-2 |
| bitnami | mediawiki | 1-26 |
| bitnami | memcached | 1-4 |
| bitnami | memcached | default |
| bitnami | modx | 2-4 |
| bitnami | mongodb | 3-2 |
| bitnami | mongodb | default |
| bitnami | moodle | 3-0 |
| bitnami | moodle | moodle-free-byol |
| bitnami | multicraft | public |
| bitnami | mybb | 1-8 |
| bitnami | mysql | 5-6 |
| bitnami | mysql | default |
| bitnami | neos | 2-0 |
| bitnami | nginxstack | 1-9 |
| bitnami | noalyss | 6-9 |
| bitnami | nodejs | 4-3 |
| bitnami | ocportal | 9 |
| bitnami | odoo | 9-0 |
| bitnami | openatrium | 2-54 |
| bitnami | opencart | 2-1 |
| bitnami | openedx | cypress |
| bitnami | openfire | 4 |
| bitnami | openproject | 5-0 |
| bitnami | orangehrm | 3-3 |
| bitnami | orocrm | 1 |
| bitnami | osclass | 3-6 |
| bitnami | osqa | 1-0rc |
| bitnami | owncloud | 8-2 |
| bitnami | oxid-eshop | 4-9 |
| bitnami | parseserver | 2-1 |
| bitnami | parseserver | default |
| bitnami | phabricator | 20160208 |
| bitnami | phpbb | 3-1 |
| bitnami | phplist | 3-2 |
| bitnami | pimcore | 3-1 |
| bitnami | piwik | 2-16 |
| bitnami | plone | 5-0 |
| bitnami | pootle | 2-7 |
| bitnami | postgresql | 9-5 |
| bitnami | postgresql | default |
| bitnami | postgresql | postgresql |
| bitnami | prestashop | 1-6-1 |
| bitnami | processmakerenterprise | 3-1 |
| bitnami | processmakeropensourceedition | 3-0 |
| bitnami | processwire | 2-7 |
| bitnami | publify | 8-2 |
| bitnami | rabbitmq | 3-6 |
| bitnami | rabbitmq | default |
| bitnami | rabbitmq | rabbitmq |
| bitnami | railo | 4-2 |
| bitnami | redash | 0-10 |
| bitnami | redis | 3-2 |
| bitnami | redis | default |
| bitnami | redmine | 3 |
| bitnami | redmineplusagile | public |
| bitnami | refinerycms | 2-1 |
| bitnami | reportserver | 2-2 |
| bitnami | reportserverenterprise | 3-0 |
| bitnami | resourcespace | 7-5 |
| bitnami | reviewboard | 2-5 |
| bitnami | reviewboardpowerpack | public |
| bitnami | roundcube | 1-1 |
| bitnami | rubystack | 2-0 |
| bitnami | seopanel | 3-8 |
| bitnami | shopware | default |
| bitnami | silverstripe | 3-2 |
| bitnami | simpleinvoices | 2013-1 |
| bitnami | simplemachinesforum | 2-0 |
| bitnami | sonarqube | 6-4 |
| bitnami | spree | 3-0 |
| bitnami | squash | 20151209 |
| bitnami | subversion | 1-8 |
| bitnami | sugarcrm | 6-5 |
| bitnami | suitecrm | 7-4 |
| bitnami | testlink | 1-9 |
| bitnami | tikiwikicmsgroupware | 14-2 |
| bitnami | tinytinyrss | 20160220 |
| bitnami | tom-cat | 7-0 |
| bitnami | trac | 1-0 |
| bitnami | typo3 | 7-6 |
| bitnami | weblate | 2-4 |
| bitnami | webmailpro | public |
| bitnami | wildfly | 10-0 |
| bitnami | wordpress | 4-4 |
| bitnami | wordpress-multisite | 4 |
| bitnami | x-cart | public |
| bitnami | x2enginesalescrm | 5-5 |
| bitnami | xoops | 2-5 |
| bitnami | youtrack | 7-0 |
| bitnami | zurmo | 3-1 |
| Canonical | UbuntuServer | 12.04.5-LTS |
| Canonical | UbuntuServer | 14.04.4-LTS |
| Canonical | UbuntuServer | 14.04.5-LTS |
| Canonical | UbuntuServer | 16.04-LTS |
| Canonical | UbuntuServer | 16.04.0-LTS |
| Canonical | UbuntuServer | 16.10 |
| Canonical | UbuntuServer | 17.04 |
| Canonical | UbuntuServer | 17.04-DAILY |
| checkpoint | check-point-r77-10 | SG-BYOL |
| checkpoint | check-point-vsec-r80 | sg-byol |
| checkpoint | sg2 | sg-byol2 |
| chef-software | chef-automate-vm-image | byol |
| cisco | cisco-asav | asav-azure-byol |
| cisco | cisco-csr-1000v | 16_6 |
| cisco | cisco-csr-1000v | 3_16 |
| cisco | cisco-csr-1000v | csr-azure-byol |
| citrix | netscalervpx-120 | netscalerbyol |
| citrix | netscalervpx110-6531 | netscalerbyol |
| citrix | netscalervpx111 | netscalerbyol |
| citrix | xenapp-server | coldfireserver |
| citrix | xenapp-vda-rdsh | coldfirerdsh |
| citrix | xenapp-vda-rdsh | server2016rdsh |
| citrix | xenapp-vda-vdi | coldfirevdi |
| citrix | xenapp-vda-vdi | server2016vdi |
| clouber | cws | cuber |
| cloudera | cloudera-centos-6 | cloudera-centos-6 |
| cloudera | cloudera-centos-os | 6_7 |
| cloudera | cloudera-centos-os | 6_8 |
| cloudera | cloudera-centos-os | 7_2 |
| cloudhub-technologies | umbraco-cms-win2012-r2 | umbraco-cms-on-win2012-r2 |
| cloudhub-technologies | wordpress-on-windows-2012-r2 | wordpress-on-windows-2012-r2 |
| codelathe | codelathe-filecloud-win2012r2 | filecloud_byol |
| codelathe | filecloud-efss-windows2016 | filecloud_windows2016 |
| commvault | commvault | csmav11 |
| composable | composable | composable-govt |
| connecting-software | cb-replicator-byol | cbrep-gov-byol |
| CoreOS | CoreOS | Stable |
| couchbase | couchbase-server-enterprise | byol |
| couchbase | couchbase-sync-gateway-enterprise | byol |
| credativ | Debian | 7 |
| credativ | Debian | 8 |
| credativ | Debian | 9-beta |
| datastax | datastax-enterprise | datastaxenterprise |
| dell_software | rapid-recovery-replication-target-vm-for-azure | quest_rr_replication_target_vm_for_azure |
| dell_software | uccs | uccs |
| derdack | enterprisealert | enterprisealert-2017-datacenter-byol |
| docker | docker-ee | docker-ee |
| docker | docker4azure-cs | docker4azure-cs-1_12 |
| docker | docker4azure-cs | docker4azure-cs-1_1x |
| dynatrace | ruxit-managed-vm | byol-managed |
| enterprise-ethereum-alliance | quorum-demo | quorum-demo |
| esri | arcgis-10-4-for-server | cloud |
| esri | arcgis-enterprise | byol |
| esri | arcgis-enterprise | byol-1051 |
| esri | arcgis-for-server | cloud |
| eventtracker | eventtracker-siem | etlm |
| eventtracker | eventtracker-siem | etsc |
| f5-networks | f5-big-ip | f5-bigip-virtual-edition-best-byol |
| f5-networks | f5-big-ip | f5-bigip-virtual-edition-better-byol |
| f5-networks | f5-big-ip | f5-bigip-virtual-edition-good-byol |
| flashgrid-inc | flashgrid-ol7-g | fg-17-05-ol74-g |
| fortinet | fortinet-fortianalyzer | fortinet-fortianalyzer |
| fortinet | fortinet-fortimanager | fortinet-fortimanager |
| fortinet | fortinet_fortigate-vm_v5 | fortinet_fg-vm |
| fortinet | fortinet_fortimail | fortinet_fortimail |
| fortinet | fortinet_fortiweb-vm_v5 | fortinet_fw-vm |
| infoblox | infoblox-vnios-te-v1420 | vnios-cp-v1400 |
| infoblox | infoblox-vnios-te-v1420 | vnios-cp-v2200 |
| infoblox | infoblox-vnios-te-v1420 | vnios-cp-v800 |
| infoblox | infoblox-vnios-te-v1420 | vnios-te-v1420 |
| infoblox | infoblox-vnios-te-v1420 | vnios-te-v2220 |
| infoblox | infoblox-vnios-te-v1420 | vnios-te-v820 |
| infoblox | infoblox-vnios-te-v1420 | vsot |
| jamcracker | jamcracker-csb-standard-v3 | jamcracker-csb-standard-v3 |
| jamcracker | jsdnapp_hybrid_v3 | jsdnapp_hybrid_v3 |
| juniper-networks | vsrx-next-generation-firewall | vsrx-byol-azure-image |
| juniper-networks | vsrx-next-generation-firewall-solution-template | vsrx-byol-azure-image-solution-template |
| kemptech | kemp360central-byol | kemp360central-byol |
| kemptech | kemp360central-byol | kemp360central-spla |
| kemptech | vlm-azure | basic-byol |
| kemptech | vlm-azure | freeloadmaster |
| kemptech | vlm-azure | vlm-byol-lts |
| kemptech | vlm-azure | vlm-spla |
| kemptech | vlm-azure | vlm-spla-lts |
| kinetica | kineticadbbyol | centos73-601 |
| mapr-technologies | mapr52-base-dev | 5202 |
| mico | mobile-impact-platform | mipvm |
| microsoft-ads | linux-data-science-vm-ubuntu | linuxdsvmubuntubyol |
| microsoft-ads | windows-data-science-vm | windows2016byol |
| MicrosoftAzureSiteRecovery | Process-Server | Windows-2012-R2-Datacenter |
| MicrosoftHybridCloudStorage | StorSimple | StorSimple-Garda-8000-Series |
| MicrosoftHybridCloudStorage | StorSimple | StorSimple-Garda-8000-Series-BBUpdate |
| MicrosoftHybridCloudStorage | StorSimpleVA | StorSimpleUpdate3RC |
| MicrosoftOSTC | FreeBSD | 10.3 |
| MicrosoftOSTC | FreeBSD | 11 |
| MicrosoftOSTC | FreeBSD | 11.0 |
| MicrosoftRServer | RServer-CentOS | Enterprise |
| MicrosoftRServer | RServer-RedHat | Enterprise |
| MicrosoftRServer | RServer-Ubuntu | Enterprise |
| MicrosoftRServer | RServer-WS2016 | Enterprise |
| MicrosoftSharePoint | MicrosoftSharePointServer | 2016 |
| MicrosoftSQLServer | SQL2008R2SP3-WS2008R2SP1 | Enterprise |
| MicrosoftSQLServer | SQL2008R2SP3-WS2008R2SP1 | Express |
| MicrosoftSQLServer | SQL2008R2SP3-WS2008R2SP1 | Standard |
| MicrosoftSQLServer | SQL2008R2SP3-WS2008R2SP1 | Web |
| MicrosoftSQLServer | SQL2012SP3-WS2012R2 | Enterprise |
| MicrosoftSQLServer | SQL2012SP3-WS2012R2 | Express |
| MicrosoftSQLServer | SQL2012SP3-WS2012R2 | Standard |
| MicrosoftSQLServer | SQL2012SP3-WS2012R2 | Web |
| MicrosoftSQLServer | SQL2012SP3-WS2012R2-BYOL | Enterprise |
| MicrosoftSQLServer | SQL2012SP3-WS2012R2-BYOL | Standard |
| MicrosoftSQLServer | SQL2014SP1-WS2012R2 | Enterprise |
| MicrosoftSQLServer | SQL2014SP1-WS2012R2 | Express |
| MicrosoftSQLServer | SQL2014SP1-WS2012R2 | Standard |
| MicrosoftSQLServer | SQL2014SP1-WS2012R2 | Web |
| MicrosoftSQLServer | SQL2014SP1-WS2012R2-BYOL | Enterprise |
| MicrosoftSQLServer | SQL2014SP1-WS2012R2-BYOL | Standard |
| MicrosoftSQLServer | SQL2014SP2-WS2012R2 | Enterprise |
| MicrosoftSQLServer | SQL2014SP2-WS2012R2 | Express |
| MicrosoftSQLServer | SQL2014SP2-WS2012R2 | Standard |
| MicrosoftSQLServer | SQL2014SP2-WS2012R2 | Web |
| MicrosoftSQLServer | SQL2014SP2-WS2012R2-BYOL | Enterprise |
| MicrosoftSQLServer | SQL2014SP2-WS2012R2-BYOL | Standard |
| MicrosoftSQLServer | SQL2016-WS2012R2 | Enterprise |
| MicrosoftSQLServer | SQL2016-WS2012R2 | Express |
| MicrosoftSQLServer | SQL2016-WS2012R2 | SQLDEV |
| MicrosoftSQLServer | SQL2016-WS2012R2 | Standard |
| MicrosoftSQLServer | SQL2016-WS2012R2 | Web |
| MicrosoftSQLServer | SQL2016-WS2012R2-BYOL | Enterprise |
| MicrosoftSQLServer | SQL2016-WS2012R2-BYOL | Standard |
| MicrosoftSQLServer | SQL2016-WS2016 | Enterprise |
| MicrosoftSQLServer | SQL2016-WS2016 | SQLDEV |
| MicrosoftSQLServer | SQL2016-WS2016 | Standard |
| MicrosoftSQLServer | SQL2016-WS2016 | Web |
| MicrosoftSQLServer | SQL2016-WS2016-BYOL | Enterprise |
| MicrosoftSQLServer | SQL2016-WS2016-BYOL | Standard |
| MicrosoftSQLServer | SQL2016SP1-WS2016 | Enterprise |
| MicrosoftSQLServer | SQL2016SP1-WS2016 | Express |
| MicrosoftSQLServer | SQL2016SP1-WS2016 | SQLDEV |
| MicrosoftSQLServer | SQL2016SP1-WS2016 | Standard |
| MicrosoftSQLServer | SQL2016SP1-WS2016 | Web |
| MicrosoftSQLServer | SQL2016SP1-WS2016-BYOL | Enterprise |
| MicrosoftSQLServer | SQL2016SP1-WS2016-BYOL | Standard |
| MicrosoftSQLServer | SQL2017-RHEL73 | Evaluation |
| MicrosoftVisualStudio | VisualStudio | VS-2015-Comm-VSU3-AzureSDK-29-WS2012R2 |
| MicrosoftVisualStudio | VisualStudio | VS-2015-Comm-VSU3-AzureSDK-291-WS2012R2 |
| MicrosoftVisualStudio | VisualStudio | VS-2015-Ent-VSU3-AzureSDK-29-WS2012R2 |
| MicrosoftVisualStudio | VisualStudio | VS-2017-Comm-Latest-WS2016 |
| MicrosoftVisualStudio | VisualStudio | VS-2017-Comm-v152-WS2016 |
| MicrosoftVisualStudio | VisualStudio | VS-2017-Comm-WS2016 |
| MicrosoftVisualStudio | VisualStudio | VS-2017-Ent-Latest-WS2016 |
| MicrosoftVisualStudio | VisualStudio | VS-2017-Ent-v152-WS2016 |
| MicrosoftVisualStudio | VisualStudio | VS-2017-Ent-WS2016 |
| MicrosoftWindowsDesktop | Windows-10 | RS2-Pro |
| MicrosoftWindowsDesktop | Windows-10 | RS2-ProN |
| MicrosoftWindowsServer | WindowsServer | 2008-R2-SP1 |
| MicrosoftWindowsServer | WindowsServer | 2012-Datacenter |
| MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter |
| MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter-smalldisk |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-Server-Core |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-Server-Core-smalldisk |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-smalldisk |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-with-Containers |
| MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-with-RDSH |
| MicrosoftWindowsServer | WindowsServer | 2016-Nano-Server |
| MicrosoftWindowsServer | WindowsServer-HUB | 2008-R2-SP1-HUB |
| MicrosoftWindowsServer | WindowsServer-HUB | 2012-Datacenter-HUB |
| MicrosoftWindowsServer | WindowsServer-HUB | 2012-R2-Datacenter-HUB |
| MicrosoftWindowsServer | WindowsServer-HUB | 2016-Datacenter-HUB |
| MicrosoftWindowsServerRemoteDesktop | WindowsServer | RDSH-Office365P |
| MicrosoftWindowsServerRemoteDesktop | WindowsServer | Remote-Desktop-Session-Host |
| netapp | netapp-oncommand-cloud-manager | occm-byol |
| netapp | netapp-ontap-cloud | ontap_cloud_byol |
| nuxeo | nuxeo-6-lts | nuxeo-6-lts |
| nuxeo | nuxeo-lts | nuxeo-lts-2015 |
| nuxeo | nuxeo-lts | nuxeo-lts-2016 |
| OpenLogic | CentOS | 6.7 |
| OpenLogic | CentOS | 6.8 |
| OpenLogic | CentOS | 6.9 |
| OpenLogic | CentOS | 7.2 |
| OpenLogic | CentOS | 7.2n |
| OpenLogic | CentOS | 7.3 |
| opentext | opentext-content-server-16 | ot-cs16 |
| Oracle | Oracle-Database-Ee | 12.1.0.2 |
| Oracle | Oracle-Database-Se | 12.1.0.2 |
| Oracle | Oracle-Linux | 6.7 |
| Oracle | Oracle-Linux | 6.8 |
| Oracle | Oracle-Linux | 7.2 |
| orfast-technologies | orfast-mam-1 | orasft_mam_01 |
| paloaltonetworks | vmseries1 | byol |
| panzura-file-system | panzura-cloud-filer | fd-vm-azure-byol |
| RedHat | RHEL | 6.8 |
| RedHat | RHEL | 6.9 |
| RedHat | RHEL | 6.9-LVM |
| RedHat | RHEL | 7-LVM |
| RedHat | RHEL | 7-RAW |
| RedHat | RHEL | 7.2 |
| RedHat | RHEL | 7.3 |
| RedHat | RHEL | 7.3-LVM |
| RedHat | RHEL | 7.4-LVM |
| RedHat | RHEL | 7.4-RAW |
| RedHat | RHEL | 7.4.Beta |
| RedHat | RHEL | 7.4.Beta-LVM |
| RedHat | rhel-byol | rhel74 |
| RedHat | RHEL-SAP-APPS | 6.8 |
| RedHat | RHEL-SAP-APPS | 7.3 |
| RedHat | RHEL-SAP-HANA | 6.7 |
| RedHat | RHEL-SAP-HANA | 7.2 |
| riverbed | riverbed-sccm-5-5-1 | riverbed-sccm-5-5-1 |
| riverbed | riverbed-steelhead-9-1-3 | steelhead-9-1-3 |
| riverbed | riverbed-steelhead-9-2 | riverbed-steelhead-9-2 |
| riverbed | riverbed-steelhead-9-5-0 | riverbed-steelhead-9-5-0 |
| riverbed | riverbed-steelhead-9-6-0 | riverbed-steelhead-9-6-0 |
| scalegrid | centos | free |
| silver-peak-systems | silver_peak_edgeconnect | silver_peak_edgeconnect_8_1 |
| silver-peak-systems | silver_peak_vx | silver-peak-vx-8-1 |
| sophos | sophos-xg | byol |
| splunk | splunk-enterprise-base-image | splunk-on-ubuntu-14-04-lts |
| stonefly | stonefly-cloud-drive | byol_stonefly |
| SUSE | openSUSE-Leap | 42.2 |
| SUSE | openSUSE-Leap | 42.3 |
| SUSE | SLES | 11-SP4 |
| SUSE | SLES | 12-SP2 |
| SUSE | SLES | 12-SP3 |
| SUSE | SLES-BYOS | 11-SP4 |
| SUSE | SLES-BYOS | 12-SP2 |
| SUSE | SLES-BYOS | 12-SP3 |
| SUSE | SLES-SAP-BYOS | 12-SP1 |
| SUSE | SLES-SAP-BYOS | 12-SP2 |
| SUSE | SLES-SAP-BYOS | 12-SP3 |
| SUSE | SLES-SAPCAL | 11-SP4 |
| SUSE | SUSE-Manager-Proxy-BYOS | 3.0 |
| SUSE | SUSE-Manager-Proxy-BYOS | 3.1 |
| SUSE | SUSE-Manager-Server-BYOS | 3.0 |
| SUSE | SUSE-Manager-Server-BYOS | 3.1 |
| suse-byos | sles-byos | 12-sp1 |
| tableau | tableau-server | bring-your-own-license |
| talon | talon-fast | talon-azure-byol |
| tenable | tenable-nessus-6-byol | tenable-nessus-byol |
| veritas | netbackup-8-0 | netbackup_8-standard |
| vidizmo | c962d038-826e-4c7f-90d9-a2d7ebb50d0c | vidizmo-appdb-single |
| vidizmo | vidizmo-highavailability-servers | vidizmo-application |
| vidizmo | vidizmo-separate-servers | vidizmo-application |
| vidizmo | vidizmo-separate-servers | vidizmo-database |
| winmagic_securedoc_cloudvm | seccuredoc_cloudvm_5 | winmagic_securedoc_cloudvm_byol |

## Next steps
* [Create a Windows virtual machine with the Azure portal](../virtual-machines/windows/quick-create-portal.md?toc=%2Fazure%2Fvirtual-machines%2Fwindows%2Ftoc.json)
* [Create a Windows virtual machine with PowerShell](../virtual-machines/windows/quick-create-powershell.md)
* [Create a Windows virtual machine with the Azure CLI](../virtual-machines/windows/quick-create-cli.md)
* [Create a Linux virtual machine with the Azure portal](../virtual-machines/linux/quick-create-portal.md?toc=%2Fazure%2Fvirtual-machines%2Flinux%2Ftoc.json)
