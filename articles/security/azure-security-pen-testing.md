<properties
   pageTitle="Pen Testing | Microsoft Azure"
   description="The article provides an overview of the penetration testing (pentest) process and how perform pentest against your apps running in Azure infrastructure."
   services="security"
   documentationCenter="na"
   authors="YuriDio"
   manager="swadhwa"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/17/2016"
   ms.author="terrylan"/>

# Pen Testing

One of the great things about using Microsoft Azure for application testing and deployment is that you don’t need to put together an on-premises infrastructure to develop, test and deploy your applications. All the infrastructure is taken care of by the Microsoft Azure platform services. You don’t have to worry about requisitioning, acquiring, and “racking and stacking” your own on-premises hardware.

This is great – but you still need to make sure you perform your normal security due diligence. One of the things you need to do is penetration test the applications you deploy in Azure.

You might already know that Microsoft performs [penetration testing of our Azure environment](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e). This helps us improve our platform and guides our actions in terms of improving security controls, introducing new security controls, and improving our security processes.
 
We don’t pen test your application for you, but we do understand that you will want and need to perform pen testing on your own applications. That’s a good thing, because when you enhance the security of your applications, you help make the entire Azure ecosystem more secure.

When you pen test your applications, it might look like an attack to us. We [continuously monitor](http://blogs.msdn.com/b/azuresecurity/archive/2015/07/05/best-practices-to-protect-your-azure-deployment-against-cloud-drive-by-attacks.aspx) for attack patterns and will initiate an incident response process if we need to. It doesn’t help you and it doesn’t help us if we trigger an incident response due to your own due diligence pen testing.
 
What to do?

When you’re ready to pen test your Azure-hosted applications, you need to let us know. Once we know that you’re going to be performing specific tests, we won’t inadvertently shut you down (such as blocking the IP address that you’re testing from), as long as your tests conform to the Azure pen testing terms and conditions.
Standard tests you can perform include:

- Tests on your endpoints to uncover the [Open Web Application Security Project (OWASP) top 10 vulnerabilities](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project)
- [Fuzz testing](https://blogs.microsoft.com/cybertrust/2007/09/20/fuzz-testing-at-microsoft-and-the-triage-process/) of your endpoints
- [Port scanning](https://en.wikipedia.org/wiki/Port_scanner) of your endpoints

One type of test that you can’t perform is any kind of [Denial of Service (DoS)](https://en.wikipedia.org/wiki/Denial-of-service_attack) attack. This includes initiating a DoS attack itself, or performing related tests that might determine, demonstrate or simulate any type of DoS attack.

Are you ready to get started with pen testing your applications hosted in Microsoft Azure? If so, then head on over to the [Penetration Test Overview](https://security-forms.azure.com/penetration-testing/terms) page (and click the Create a Testing Request button at the bottom of the page. You’ll also find more information on the pen testing terms and conditions and helpful links on how you can report security flaws related to Azure or any other Microsoft service.
