<properties
   pageTitle="Disable, enable, or delete a Traffic Manager profile"
   description="This article will help you work with your Traffic Manager profiles."
   services="traffic-manager"
   documentationCenter="na"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/23/2015"
   ms.author="cherylmc" />

# Disable, Enable, or Delete a Profile

## Disable or enable a profile

You can disable an existing Traffic Manager profile so that it will not refer user requests to its configured endpoints. When you disable a Traffic Manager profile, the profile itself and the information contained in the profile will remain intact and can be edited in the Traffic Manager interface. When you want to re-enable the profile, you can easily do so in the Management Portal and referrals will resume. When you create a Traffic Manager profile in the Management Portal, it’s automatically enabled.

### To disable a profile

1. Modify the DNS resource record on your Internet DNS server to use the appropriate record type and pointer to either another name or the IP address of a specific location on the Internet. In other words, change the DNS resource record on your Internet DNS server so that it no longer uses a CNAME resource record that points to the domain name of your Traffic Manager profile.
1. Traffic will stop being directed to the endpoints through the Traffic Manager profile settings.
1. Select the profile that you want to disable. To select the profile, on the Traffic Manager page, highlight the profile by clicking the column next to the profile name. Do not click the name of the profile or the arrow next to the name, as this will take you to the settings page for the profile.
1. After selecting the profile, click Disable at the bottom of the page.

### To enable a profile

1. Select the profile that you want to enable. To select the profile, on the Traffic Manager page, highlight the profile by clicking the column next to the profile name. Do not click the name of the profile or the arrow next to the name, as this will take you to the settings page for the profile.
1. After selecting the profile, click Enable at the bottom of the page.
1. Modify the DNS resource record on your Internet DNS server to use the CNAME record type, which maps your company domain name to the domain name of your Traffic Manager profile. For more information, see [Point a Company Internet Domain to a Traffic Manager Domain](point-a-company-internet-domain-to-a-traffic-manager-domain.md).
1. Traffic will start being directed to the endpoints again.

## Delete a profile


### To delete a profile

1. Ensure that the DNS resource record on your Internet DNS server no longer uses a CNAME resource record that points to the domain name of your Traffic Manager profile.
1. Select the profile that you want to delete. To select the profile, on the Traffic Manager page, highlight the profile by 
1. clicking the column next to the profile. Do not click the name of the profile or the arrow next to the name, as this will take you to the settings page for the profile.
1. After selecting the profile, click Delete at the bottom of the page.

## See Also

[Traffic Manager](traffic-manager.md)

[Traffic Manager Configuration Tasks](https://msdn.microsoft.com/library/azure/hh744830.aspx)


