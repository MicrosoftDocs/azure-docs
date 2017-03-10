# Overview	
## [About Web Apps](app-service-web-overview.md)
## [Compare hosting options](choose-web-site-cloud-service-vm.md)

# QuickStart	
## [Create static HTML site](app-service-web-get-started-html.md)
## [Create ASP.NET app](app-service-web-get-started-dotnet.md)		
## [Create PHP app](app-service-web-get-started-php.md) 
## [Create Node.js app](app-service-web-get-started-nodejs.md) 
## [Create Java app](app-service-web-get-started-java.md)		
## [Create Python app](app-service-web-get-started-python.md)	

# Samples
## [Azure CLI](app-service-cli-samples.md) 
## [PowerShell](app-service-powershell-samples.md) 

# Tutorials
## [Add functionality to web app](app-service-web-get-started-2.md)
## [ASP.NET app with SQL Database](web-sites-dotnet-get-started.md)
## [Laravel app with MySQL](app-service-web-php-get-started.md)
## [Sails.js app with NOSQL DB](app-service-web-nodejs-sails.md)
## [Java app with Eclipse](app-service-web-eclipse-create-hello-world-web-app.md)
## [Java app with IntelliJ](app-service-web-intellij-create-hello-world-web-app.md)
## [Django app with MySQL](web-sites-python-ptvs-django-mysql.md)

# Concepts
## [How App Service works](../app-service/app-service-how-works-readme.md?toc=%2fazure%2fapp-service-web%2ftoc.json)	
## [App Service plans](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md?toc=%2fazure%2fapp-service-web%2ftoc.json)	
## [App Service Environments](app-service-app-service-environment-intro.md)
## [Authentication and authorization](../app-service/app-service-authentication-overview.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
## [Authentication with on-premises AD](web-sites-authentication-authorization.md)


# How-To guides
## Develop your app	
### ASP.NET

#### [Develop an ASP.NET Core app with VS Code](web-sites-create-web-app-using-vscode.md)
### PHP
#### [Set up your PHP project](web-sites-php-configure.md)
#### [Set up your WordPress Multisite](web-sites-php-convert-wordpress-multisite.md) 
### Node.js
#### [Use io.js](web-sites-nodejs-iojs.md)
#### [Debug Node.js app](web-sites-nodejs-debug.md)
### Java

#### [Use Azure SDK for Java](java-create-azure-website-using-java-sdk.md)
#### [Upload existing app](web-sites-java-add-app.md)
#### [Remote debug Eclipse](app-service-web-debug-java-web-app-in-eclipse.md)
#### [Remote debug IntelliJ](app-service-web-debug-java-web-app-in-intellij.md)

### [Send emails with SendGrid](sendgrid-dotnet-how-to-send-email.md)

### Configure runtime	
#### [PHP on Windows](web-sites-php-configure.md)

#### [Java](web-sites-java-add-app.md)
#### [Node.js on Linux](app-service-linux-using-nodejs-pm2.md)
#### [Python](web-sites-python-configure.md)
			
### Configure application
#### [Use app settings](web-sites-configure.md)
			
## [Deploy to Azure](web-sites-deploy.md)
### [Deploy via FTP](app-service-deploy-content-sync.md)
### [Deploy via cloud sync](web-sites-deploy.md)
### [Deploy continuously](app-service-continuous-deployment.md)
### [Deploy to staging](web-sites-staged-publishing.md)
### [Deploy from local Git](app-service-deploy-local-git.md)
### [Deploy with template](app-service-deploy-complex-application-predictably.md)
### [Agile deployment](app-service-agile-software-development.md)
### [Beta testing](app-service-web-test-in-production-controlled-test-flight.md)

### [Set deployment credentials](app-service-deployment-credentials.md)

### Map custom domain
#### [Buy domain](custom-dns-web-site-buydomains-web-app.md)
#### [Map 3rd-party domain](web-sites-custom-domain-name.md)
#### [Map domains with Traffic Manager](web-sites-traffic-manager-custom-domain-name.md)
#### [Map GoDaddy domains](web-sites-godaddy-custom-domain-name.md)
#### [Migrate an active domain](app-service-custom-domain-name-migrate.md)

### [Migrate from IIS](web-sites-migration-from-iis-server.md)
### [Test in production](app-service-web-test-in-production-get-start.md)
### [Run performance tests](app-service-web-app-performance-test.md) 

## Connect to DB/resources		

### [Connect to on-premises data](web-sites-hybrid-connection-get-started.md) 
### [Connect to Azure VNet](web-sites-integrate-with-vnet.md)
### [Connect to Azure VNet with PowerShell](app-service-vnet-integration-powershell.md)
### [Connect to MongoDB on Azure VM](web-sites-dotnet-store-data-mongodb-vm.md)
			
##Secure app
### Authenticate users		
#### [Authenticate with Azure AD](../app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
#### [Authenticate with Facebook](../app-service-mobile/app-service-mobile-how-to-configure-facebook-authentication.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
#### [Authenticate with Google](../app-service-mobile/app-service-mobile-how-to-configure-google-authentication.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
#### [Authenticate with Microsoft account](../app-service-mobile/app-service-mobile-how-to-configure-microsoft-authentication.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
#### [Authenticate with Twitter](../app-service-mobile/app-service-mobile-how-to-configure-twitter-authentication.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
#### [Authenticate with on-prem AD](web-sites-authentication-authorization.md)
#### [App with a multi-tenant database](web-sites-dotnet-entity-framework-row-level-security.md)
### Assign custom SSL
#### [Buy SSL cert](web-sites-purchase-ssl-web-site.md)
#### [Configure 3rd-party SSL cert](web-sites-configure-ssl-certificate.md)
### [Enforce HTTPS](web-sites-configure-ssl-certificate.md#enforce-https-on-your-app)
### [Configure TLS mutual authentication](app-service-web-configure-tls-mutual-auth.md)
			
##Scale app		
### [Scale up](web-sites-scale.md)
### [Scale out](../monitoring-and-diagnostics/insights-how-to-scale.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
### [Load-balance with Traffic Manager](web-sites-traffic-manager.md)
### [High-scale with App Service Environments](../app-service/app-service-app-service-environments-readme.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
### [Use Azure CDN for global reach](cdn-websites-with-cdn.md)
### [Connect to Redis Cache via Memcache](web-sites-connect-to-redis-using-memcache-protocol.md)
### [Create a Redis Cache](../redis-cache/cache-redis-cache-arm-provision.md?toc=%2fazure%2fapp-service-web%2ftoc.json)
### [Manage session state with Azure Redis cache](web-sites-dotnet-session-state-caching.md)

## Monitor 
### [Monitor apps](web-sites-monitor.md)
### [Enable logs](web-sites-enable-diagnostic-log.md)
### [Stream logs](web-sites-streaming-logs-and-console.md)

## Back up content		
### [Back up your app](web-sites-backup.md)
### [Restore your app from backup](web-sites-restore.md)
### [Backup with REST API](websites-csm-backup.md)

## Manage app resources
### [Clone app with PowerShell](app-service-web-app-cloning.md)
### [Clone app with portal](app-service-web-app-cloning-portal.md)
### [Move resources](app-service-move-resources.md)
### [Use Azure Resource Manager with PowerShell](app-service-web-app-azure-resource-manager-powershell.md)
### [Manage apps using Azure Automation](automation-manage-web-app.md)



# Reference	
## [CLI 2.0](/cli/azure/appservice)
## [PowerShell](/powershell)
## [REST API](/rest/api/appservice/) 
		
# Resources	
## Troubleshooting		
### [Troubleshoot with Visual Studio](web-sites-dotnet-troubleshoot-visual-studio.md)
### [Troubleshoot Node.js app](app-service-web-nodejs-best-practices-and-troubleshoot-guide.md)
### [Troubleshoot HTTP 502 & 503](app-service-web-troubleshoot-http-502-http-503.md)
### [Troubleshoot performance issues](app-service-web-troubleshoot-performance-degradation.md)
## [Pricing](https://azure.microsoft.com/pricing/details/app-service/) 	
## [Quota Information](../azure-subscription-service-limits.md#app-service-limits)	
## [Service Updates & Release Notes](https://azure.microsoft.com/updates/?product=app-service)	
## [Best practices](app-service-best-practices.md)
## [Samples](https://azure.microsoft.com/resources/samples/?service=app-service)	
## [Videos](https://azure.microsoft.com/resources/videos/index/?services=app-service)
## Cookbooks	
### [Reference Architectures](../guidance/guidance-ra-app-service.md)	
### [Deployment Scripts](https://azure.microsoft.com/documentation/scripts/)	
