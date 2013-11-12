<properties linkid="websites-digital-marketing-campaign" urlDisplayName="Create a Digital Marketing Campaign on Windows Azure Web Sites" pageTitle="Create a Digital Marketing Campaign on Windows Azure Web Sites" metaKeywords="Web Sites" metaDescription="Understand tasks associated with using Windows Azure Web Sites for digital marketing campaigns." umbracoNaviHide="0" disqusComments="1" writer="jroth" editor="mollybos" manager="paulettm" /> 



# Create a Digital Marketing Campaign on Windows Azure Web Sites
This guide provides a technical overview of how to use Windows Azure Web Sites to create digital marketing campaigns. A digital marketing campaign is typically a short-lived entity that is meant to drive a short-term marketing goal. There are two main scenarios to consider. In the first scenario, a third-party marketing firm creates and manages the campaign for their customer for the duration of the promotion. A second scenario involves the marketing firm creating and then transferring ownership of the digital marketing campaign resources to their customer. The customer then runs and manages the digital marketing campaign on their own. 

Windows Azure Web Sites is a good match for both scenarios. It provides fast creation, supports multiple frameworks and languages, scales to meet user demand, and accommodates many deployment and source control systems. By using Windows Azure, you also have access to other Windows Azure services, such as Media Services, which can enhance a marketing campaign.

Although it is possible to use Windows Azure Cloud Services or Windows Azure Virtual Machines to host web sites, it is not the ideal choice for this scenario unless there is a required feature that Windows Azure Web Sites does not provide. To understand the options, see Windows Azure Web Sites, Cloud Services, and VMs: When to use which?.

The following areas are addressed in this guide:

- Deploy Existing Web Sites
- Integrate with Social Media
- Scale with User Demand
- Integrate with Other Services
- Monitor the Campaign

<div class="dev-callout">
<strong>Note</strong>
<p>This guide presents some of the most common areas and tasks that are aligned with public-facing .COM site development. However, there are other capabilities of Windows Azure Web Sites that you can use in your specific implementation. To review these capabilities, also see the other guides on Global Web Presence and Business Applications.</p>
</div>

##<a name="deployexisting"></a>Deploy Existing Web Sites


  [websitesoverview]:http://www.windowsazure.com/en-us/documentation/services/web-sites/
  [DigitalMarketingDeploy1]: ../media/DigitalMarketing_Deploy1.png
  [DigitalMarketingDeploy2]: ../media/DigitalMarketing_Deploy2.png
  [DigitalMarketingFrameworkVersions]: ../media/DigitalMarketing_FrameworkVersions.png
  [DigitalMarketingFacebook]: ../media/DigitalMarketing_Facebook.png
  [DigitalMarketingScale]: ../media/DigitalMarketing_Scale.png
  [DigitalMarketingAutoScale]: ../media/DigitalMarketing_AutoScale.png
  [DigitalMarketingMonitor]: ../media/DigitalMarketing_Monitor.png
  [DigitalMarketingUsageOverview]: ../media/DigitalMarketing_UsageOverview.png
