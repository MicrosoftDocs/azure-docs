<properties
   pageTitle="Implementing security recommendations in Azure Security Center  | Microsoft Azure"
   description="This document walks you through how recommendations in Azure Security Center help you protect your Azure resources and stay in compliance with security policies."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="11/30/2015"
   ms.author="terrylan"/>

# Implementing security recommendations in Azure Security Center

This document walks you through how recommendations in Azure Security Center help you protect your Azure resources.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This is an introduction to the service using an example deployment.  This is not a step-by-step guide.

## What is Azure Security Center?
Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

##What is a security recommendation?
Azure Security Center is continually analyzing the security state of your Azure resources. When potential security vulnerabilities are identified, recommendations are created. The recommendations guide you through the process of configuring the needed control.

## Setting recommendations

In [Setting security policies in Azure Security Center](https://azure.microsoft.com/documentation/articles/security-center-policies/) you learn to:

- Configure security policies
- Turn on data collection
- Choose which recommendations to see as part of your security policy

Policy recommendations currently available center around system updates, baseline rules, antimalware, ACL for endpoints, network security groups on subnets and network interfaces, SQL auditing, SQL transparent data encryption, and web application firewall.  [Setting security policies](https://azure.microsoft.com/documentation/articles/security-center-policies/) provides a description of each recommendation option.

The **Show recommendations for** section of the **Security policy** blade gives you a list of recommendations that you can turn on for the resources in the specified subscription.

![][1]

## Monitoring recommendations

After setting a security policy, Azure Security Center analyses the security state of your resources to identify potential vulnerabilities. The **Recommendations** tile on the **Security Center** blade lets you know the total amount of recommendations identified by Azure Security Center.

![][2]

To see the details of each recommendation:

1. Click the **Recommendations tile** on the **Security Center** blade.  The **Recommendations** blade opens.
2. You can filter the recommendations presented to you by state and severity.  Click **Filter** on the **Recommendations** blade.  The Filter blade opens and you select the severity and state values you wish to see.
![][3]

3. If you determine that a recommendation is not applicable, you can dismiss the recommendation and then filter it out of your view. There are two ways to dismiss a recommendation. Right click an item and select **Dismiss** or hover over an item, click the three dots that appear to the right, and select **Dismiss**.
![][4]

The recommendations are shown in a table format where each line represents one particular recommendation. The columns of this table are:

- **DESCRIPTION**: an explanation of the recommendation and what needs to be done to address it
- **RESOURCE**: for which resource(s) this recommendation is applicable
- **STATE**: the current state of the recommendation:
  - **Open**: not addressed yet
  - **In Progress**: recommendation is currently being applied to those resources, no action is required by you
  - **Resolved**: recommendation was already completed (when state is resolved, the color of the line is grayed out)
- **SEVERITY**: describes the severity of that particular recommendation:
  - **High**: a vulnerability exists with a meaningful resource (application, VM, network security group) and requires attention
  - **Medium**: non-critical or additional steps required to complete a process or eliminate a vulnerability
  - **Low**: a vulnerability due to missing system updates or rules mismatch that should be addressed but does not require immediate attention. (By default, a low recommendation  is not presented but you can filter on Low recommendations if you choose to view them.)

Use the table below as a reference to understand the available recommendations and what each one will do if you apply it:

| Recommendation | Description |
|----- |-----|
| Enable Data Collection for subscriptions/virtual machines | Recommends that you turn on Data Collection in the Security Policy for select VMs. |
| Resolve mismatch baseline rules | Recommends that you align OS configurations with the recommended baselines, eg do not allow passwords to be saved. |
| Apply system updates | Recommends that you deploy missing system updates to VMs. |
| Configure ACLs for endpoint | Recommends that you configure an Access Control list to restrict inbound access to VMs. |
| Add a web application firewall | Recommends that you deploy a Web Application Firewall (WAF) for web endpoints. |
| Reroute traffic through web application firewall | To complete the configuration of a WAF, traffic must be rerouted to the WAF appliance. This recommendation will complete the necessary configuration changes. |
| Enable Antimalware | Recommends that you provision antimalware to VMs. |
| Enable Network Security Groups on subnets/network interfaces | Recommends that you enable Network Security Groups (NSGs) on subnets and network interfaces. |
| Restrict access through public external endpoints | Recommends that you configure inbound traffic rules for NSGs. |
| Enable SQL Auditing on SQL servers/databases | Recommends that you turn on Auditing for SQL servers and databases. |
| Enable Transparent Data Encryption on SQL databases | Recommends that you enable encryption for SQL databases. |
| Deploy the VM Agent | Enables you to see which VMs require the VM Agent. The VM Agent must be installed on VMs in order to provision Patch Scanning, Baseline Scanning, and Antimalware. The VM Agent is installed by default for VMs deployed from the Azure Marketplace. Information on how to install the VM Agent is available [here](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/) |

## Applying recommendations
After reviewing all recommendations, you may decide which one you should apply first. It is recommended to use the severity rating as the main parameter to evaluate which recommendations should be applied first.
Using the Antimalware recommendation, let’s walk through an example on how to apply a recommendation:

1. In the **Recommendations** blade, select **Enable Antimalware**.
![][5]

2. In the **Install Antimalware** blade select from the list of virtual machine(s) without antimalware enabled and click **Install Antimalware**.
3. The **New resource** blade opens to allow you to select the antimalware solution you want to use. Select **Microsoft Antimalware**.
4. Additional information about the antimalware solution is displayed. Select **Create**.
5. Enter the required configuration settings on the **Add Extension** blade, and select **OK**.
![][6]

[Microsoft Antimalware](https://azure.microsoft.com/documentation/articles/azure-security-antimalware/) is now active on the selected virtual machine.

## Deploying integrated partner solutions

A recommendation may be to deploy an integrated security solution from a Microsoft partner.  Let’s walk through an example on how to do this:

1. Return to the **Recommendations** blade.
2.	Select recommendation **Secure web application using web application firewall**. This opens the **Unprotected Web Applications** blade.
![][7]
3. Select a web application, the **Add a Web Application Firewall** blade opens.
4. Select **Barracuda Web Application Firewall**.  A blade opens that provides you information about the **Barracuda Web Application Firewall**.
5. Click **Create** in the information blade.  The **New Web Application Firewall** blade opens, where you can perform **VM Configuration** steps and provide **WAF Information**.
6. Select **VM Configuration**. In the **VM Configuration** blade you enter information required to spin up the virtual machine that will run the WAF.
![][8]
7. Return to the **New Web Application Firewall** blade and select **WAF Information**. In the **WAF Information** blade you configure the WAF itself. Step 6 allows you to configure the virtual machine on which the WAF will run and step 7 enables you to provision the WAF itself.

8. Return to the **Recommendations** blade.  A new entry was generated after you created the WAF, **Reroute traffic through Web Application Firewall**. This lets you know that you need to complete the process of actually wiring up the WAF within the Azure Virtual Network so that it can protect the application.
![][9]

9. Select **Reroute traffic through Web Application Firewall** and a new blade opens. You can see that you have a couple of web applications that need the traffic rerouted.
![][10]

10. Select a web application and a blade opens that gives you information on the application needing the traffic rerouted. Click **Reroute** and Azure Security Center does the wiring-up for you.
![][11]

The logs from that WAF are now fully integrated.  Azure Security Center can start automatically gathering and analyzing the logs so that it can surface important security alerts to you.

## Next steps
In this document, you were introduced to security recommendations in Azure Security Center.  To learn more about Azure Security Center, see the following:

- [Setting security policies in Azure Security Center](https://azure.microsoft.com/documentation/articles/security-center-policies/) – Learn how to configure security policies
- [Security monitoring in Azure Security Center](https://azure.microsoft.com/documentation/articles/security-center-monitoring/) – Learn how to monitor the health of your Azure resources
- [Managing and responding to security alerts in Azure Security Center](https://azure.microsoft.com/documentation/articles/security-center-managing-and-responding-alerts/) - Learn how to manage and respond to security alerts
- [Azure Security Center FAQ](https://azure.microsoft.com/documentation/articles/security-center-faq/) – Find frequently asked questions about using the service
- [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/) – Find blog posts about Azure security and compliance

<!--Image references-->
[1]: ./media/security-center-recommendations/show-recommendations-for.png
[2]: ./media/security-center-recommendations/recommendations-tile.png
[3]: ./media/security-center-recommendations/filter-recommendations.png
[4]: ./media/security-center-recommendations/dismiss-recommendations.png
[5]: ./media/security-center-recommendations/select-enable-antimalware.png
[6]: ./media/security-center-recommendations/install-antimalware.png
[7]: ./media/security-center-recommendations/secure-web-application.png
[8]: ./media/security-center-recommendations/show-recommendations-for.png
[9]: ./media/security-center-recommendations/reroute-traffic.png
[10]: ./media/security-center-recommendations/reroute-traffic-through-waf.png
[11]: ./media/security-center-recommendations/click-reroute.png
