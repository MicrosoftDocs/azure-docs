# Overview
## [What is Cloud Services?](cloud-services-choose-me.md)
## [Cloud service config files and packaging](cloud-services-model-and-package.md)

# Get Started
## [Example .NET Cloud Service](cloud-services-dotnet-get-started.md)
## [Example Python for Visual Studio Cloud Service](cloud-services-python-ptvs.md)
## [Set up a hybrid HPC cluster with Microsoft HPC Pack](cloud-services-setup-hybrid-hpcpack-cluster.md)

# How To
## Plan
### [Virtual machine sizes](cloud-services-sizes-specs.md)
### [Updates](cloud-services-update-azure-service.md)

## Develop
### [Create PHP web and worker roles](../cloud-services-php-create-web-role.md)
### [Build and deploy a Node.js application](cloud-services-nodejs-develop-deploy-app.md)
### [Build a Node.js web application using Express](cloud-services-nodejs-develop-deploy-express-app.md)
### Storage and Visual Studio
#### [Blob storage and connected services](../storage/vs-storage-cloud-services-getting-started-blobs.md)
#### [Queue storage and connected services](../storage/vs-storage-cloud-services-getting-started-queues.md)
#### [Table storage and connected services](../storage/vs-storage-cloud-services-getting-started-tables.md)
### Configure packages for continuous build and deploy
#### [Visual Studio Team Services and Git](cloud-services-continuous-delivery-use-vso-git.md)
#### [Visual Studio Team Services](cloud-services-continuous-delivery-use-vso.md)
#### [TFS and Team Build](cloud-services-dotnet-continuous-delivery.md)
### [Configure traffic rules for a role](cloud-services-enable-communication-role-instances.md)
### [Handle Cloud Service lifecycle events](cloud-services-role-lifecycle-dotnet.md)
### [Socket.io (Node.js)](cloud-services-nodejs-chat-app-socketio.md)
### [Use Twilio to make a phone call (.NET)](../partner-twilio-cloud-services-dotnet-phone-call-web-role.md)
### [New Relic](../store-new-relic-cloud-services-dotnet-application-performance-management.md)

### Configure start up tasks
#### [Create startup tasks](cloud-services-startup-tasks.md)
#### [Common startup tasks](cloud-services-startup-tasks-common.md)
#### [Use a task to Install .NET on a Cloud Service role](cloud-services-dotnet-install-dotnet.md)

### Configure Remote Desktop
#### [Portal](cloud-services-role-enable-remote-desktop-new-portal.md)
#### [Classic portal](cloud-services-role-enable-remote-desktop.md)
#### [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md)

## Deploy
### Create and deploy a cloud service in portal
#### [Portal](cloud-services-how-to-create-deploy-portal.md)
#### [Classic portal](cloud-services-how-to-create-deploy.md)
### [Create an empty cloud service container in PowerShell](cloud-services-powershell-create-cloud-container.md)
### Configure a custom domain name
#### [Portal](cloud-services-custom-domain-name-portal.md)
#### [Classic portal](cloud-services-custom-domain-name.md)
### [Stage a cloud service deployment (Node.js)](cloud-services-nodejs-stage-application.md)
### [Connect to a custom Domain Controller](cloud-services-connect-to-custom-domain.md)

## Manage service
### Common management tasks
#### [Portal](cloud-services-how-to-manage-portal.md)
#### [Classic portal](cloud-services-how-to-manage.md)
### Configure Cloud Service
#### [Portal](cloud-services-how-to-configure-portal.md)
#### [Classic portal](cloud-services-how-to-configure.md)
### [Manage a Cloud Service using Azure Automation](automation-manage-cloud-services.md)
### Configure automatic scaling
#### [Portal](cloud-services-how-to-scale-portal.md)
#### [Classic portal](cloud-services-how-to-scale.md)
### [Use Python to manage Azure Resources](cloud-services-python-how-to-use-service-management.md)

### [Guest OS patches](cloud-services-guestos-msrc-releases.md)
### Guest OS retirement
#### [Retirement policy](cloud-services-guestos-retirement-policy.md)
#### [Family 1 retirement notice](cloud-services-guestos-family1-retirement.md)
### [Guest OS release news](cloud-services-guestos-update-matrix.md)
### [Cloud Services Role config XPath cheat sheet](cloud-services-role-config-xpath.md)

## Manage certificates
### [Cloud Services and management certificates](cloud-services-certs-create.md)
### Configure SSL 
#### [Portal](cloud-services-configure-ssl-certificate-portal.md)
#### [Classic portal](cloud-services-configure-ssl-certificate.md)

## Monitor
### [Monitor cloud service](cloud-services-how-to-monitor.md)
### [Test performance](../vs-azure-tools-performance-profiling-cloud-services.md)
#### [Test with Visual Studio Profiler](cloud-services-performance-testing-visual-studio-profiler.md)
### Enable diagnostics
#### [PowerShell](cloud-services-diagnostics-powershell.md)
#### [.NET](cloud-services-dotnet-diagnostics.md)
#### [Visual Studio](../vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines.md)
### [Use performance counters in Azure Diagnostics](cloud-services-dotnet-diagnostics-performance-counters.md)
### [Store and view diagnostic data in Azure Storage](cloud-services-dotnet-diagnostics-storage.md)
### [Trace Cloud Service with Diagnostics](cloud-services-dotnet-diagnostics-trace-flow.md)
### [Send diagnostic data to App Insights](cloud-services-dotnet-diagnostics-applicationinsights.md)

## Troubleshoot
### Debug 
#### [Enable remote debugging with cont. delivery](cloud-services-virtual-machines-dotnet-continuous-delivery-remote-debugging.md)
#### [Options for a Cloud Service](../vs-azure-tools-debugging-cloud-services-overview.md)
#### [Local Cloud Service with Visual Studio](../vs-azure-tools-debug-cloud-services-virtual-machines.md)
#### [Published Cloud Service with Visual Studio](../vs-azure-tools-intellitrace-debug-published-cloud-services.md)
### [Cloud Service allocation failure](cloud-services-allocation-failures.md)
### [Common causes of Cloud Service roles recycling](cloud-services-troubleshoot-common-issues-which-cause-roles-recycle.md)
### [Default TEMP folder size too small for role](cloud-services-troubleshoot-default-temp-folder-size-too-small-web-worker-role.md)
### [Common deployment problems](cloud-services-troubleshoot-deployment-problems.md)
### [Role failed to start](cloud-services-troubleshoot-roles-that-fail-start.md)
### [Recovery guidance](cloud-services-disaster-recovery-guidance.md)
### Cloud Services FAQ
#### [Application and service availability FAQ](cloud-services-application-and-service-availability-faq.md)
#### [Configuration and management FAQ](cloud-services-configuration-and-management-faq.md)
#### [Connectivity and networking FAQ](cloud-services-connectivity-and-networking-faq.md)
#### [Deployment FAQ](cloud-services-deployment-faq.md)

# Reference
## [.csdef XMLSchema](https://msdn.microsoft.com/library/azure/ee758711)
## [.cscfg XMLSchema](https://msdn.microsoft.com/library/azure/ee758710)
## [REST](https://msdn.microsoft.com/library/azure/ee460812)

# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/cloud-services/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/en-us/home?forum=windowsazuredevelopment)
## [Pricing](https://azure.microsoft.com/pricing/details/cloud-services/)
## [Service updates](https://azure.microsoft.com/updates/?product=cloud-services&updatetype=&platform=)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=cloud-services)
