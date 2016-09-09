<properties
	pageTitle="What are Mobile Apps"
	description="Learn what advantages does App Service bring to your enterprise mobile apps."
	services="app-service\mobile"
	documentationCenter=""
	authors="adrianhall"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="na"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="05/03/2016"
	ms.author="krisagh"/>

# <a name="getting-started"> </a>What are Mobile Apps?

Azure App Service is a fully managed [Platform as a Service](https://azure.microsoft.com/overview/what-is-paas/) (PaaS) offering for professional developers
that brings a rich set of capabilities to web, mobile and integration scenarios. *Mobile Apps* in
*Azure App Service* offer a highly scalable, globally available mobile application development platform
for Enterprise Developers and System Integrators that brings a rich set of capabilities to mobile developers.

![Mobile Apps](./media/app-service-mobile-value-prop/overview.png)

##Why Mobile Apps?
*Mobile Apps* in *Azure App Service* offers a highly scalable, globally available mobile application
development platform for Enterprise Developers and System Integrators that brings a rich set of capabilities
to mobile developers. With Mobile Apps you can:

- **Build native and cross platform apps** - whether you're building native iOS, Android, and Windows apps
  or cross-platform Xamarin or Cordova (Phonegap) apps, you can take advantage of App Service using native SDKs.
- **Connect to your enterprise systems** - with Mobile Apps you can add corporate sign on in minutes, and
  connect to your enterprise on-premises or cloud resources.
- **Build offline-ready apps with data sync** - make your mobile workforce productive by building apps that
  work offline and use Mobile Apps to sync data in the background when connectivity is present with any of your
  enterprise data sources or SaaS APIs.
- **Push Notifications to millions in seconds** - engage your customers with instant push notifications on
any device, personalized to their needs, sent when the time is right.

## Mobile App Features
The following features are important to cloud-enabled mobile development:

- **Authentication and Authorization** - Select from an ever-growing list of identity providers, including
  Azure Active Directory for enterprise authentication, plus social providers like Facebook, Google, Twitter
  and Microsoft Account.  Azure Mobile Apps provides an OAuth 2.0  service for each provider.  You can also
  integrate the SDK for the identity provider for provider specific functionality.

  Discover more about our [authentication features].

- **Data Access** - Azure Mobile Apps provides a mobile-friendly OData v3 data source linked to SQL Azure or
  an on-premise SQL Server.  This service can be based on Entity Framework, allowing you to easily integrate
  with other NoSQL and SQL data providers, including [Azure Table Storage], MongoDB, [DocumentDB] and SaaS API
  providers like Office 365 and Salesforce.com.
- **Offline Sync** - Our Client SDKs make it easy for you to build robust and responsive mobile applications
  that operate with an offline data set that can be automatically synchronized with the backend data, including
  conflict resolution support.

  Discover more about our [data features].

- **Push Notifications** - Our Client SDKS seamlessly integrate with the registration capabilities of Azure
  Notification Hubs, allowing you to send push notifications to millions of users simultaneously.

  Discover more about our [push notification features].

- **Client SDKs** - We provide a complete set of Client SDKs that cover native development ([iOS], [Android] and
  [Windows]), cross-platform development ([Xamarin for iOS and Android], [Xamarin Forms]) and hybrid application
  development ([Apache Cordova]).  Each client SDK is available with an MIT license and is open-source.

## Azure App Service Features.
The following platform features are generally useful for mobile production sites.

- **Auto Scaling** - App Service enables you to quickly scale-up or out to handle any incoming customer
  load. Manually select the number and size of VMs or set up auto-scaling to scale your mobile app backend
  based on load or schedule.

  Discover more about [auto scaling].

- **Staging Environments** - App Service can run multiple versions of your site, allowing you to perform A/B testing, test
  in production as part of a larger DevOps plan and do in-place staging of a new backend.

  Discover more about [staging environments].

- **Continuous Deployment** - App Service can integrate with common SCM systems, allowing you to automatically deploy
  a new version of your backend by pushing to a branch of your SCM system.

  Discover more about [deployment options].

- **Virtual Networking** - App Service can connect to on-premise resources using virtual network, ExpressRoute or hybrid
  connections.

  Discover more about [hybrid connections], [virtual networks], and [ExpressRoute].

- **Isolated / Dedicated Environments** - App Service can be run in a fully isolated and dedicated enviroment for securely
  running Azure App Service apps at high scale.  This is ideal for application workloads requiring very high scale, isolation
  or secure network access.

  Discover more about [App Service Environments].

## Getting Started ##
To get started with Mobile Apps, follow the [Get Started] tutorial.  This will cover the basics
of producing a mobile backend and client of your choice, then integrating authentication, offline
sync and push notifications.  You can follow the [Get Started] tutorial several times - once for
each client application.

For more information on Azure Mobile Apps, please review our [learning map].
For more information on the Azure App Service platform, see [Azure App Service].

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an
>Azure account, go to [Try App Service](https://tryappservice.azure.com/?appServiceName=mobile), where
>you can immediately create a short-lived starter web app in App Service. No credit cards required;
>no commitments.

<!-- URLs. -->
[Migrate your Mobile Service to App Service]: app-service-mobile-migrating-from-mobile-services.md
[Azure App Service]: ../app-service/app-service-value-prop-what-is.md
[Get Started]: app-service-mobile-ios-get-started.md
[Azure Table Storage]: ../storage/storage-getting-started-guide.md
[DocumentDB]: ../documentdb/documentdb-get-started.md
[authentication features]: ./app-service-mobile-auth.md
[data features]: ./app-service-mobile-offline-data-sync.md
[push notification features]: ../notification-hubs/notification-hubs-overview.md
[iOS]: ./app-service-mobile-ios-how-to-use-client-library.md
[Android]: ./app-service-mobile-android-how-to-use-client-library.md
[Windows]: ./app-service-mobile-dotnet-how-to-use-client-library.md
[Xamarin for iOS and Android]: ./app-service-mobile-dotnet-how-to-use-client-library.md
[Xamarin Forms]: ./app-service-mobile-xamarin-forms-get-started.md
[Apache Cordova]: ./app-service-mobile-cordova-how-to-use-client-library.md
[auto scaling]: ../app-service-web/web-sites-scale.md
[staging environments]: ../app-service-web/web-sites-staged-publishing.md
[deployment options]: ../app-service-web/web-sites-deploy.md
[hybrid connections]: ../app-service-web/web-sites-hybrid-connection-get-started.md
[virtual networks]: ../app-service-web/web-sites-integrate-with-vnet.md
[ExpressRoute]: ../app-service/app-service-app-service-environment-network-configuration-expressroute.md
[App Service Environments]: ../app-service-web/app-service-app-service-environment-intro.md
[learning map]: https://azure.microsoft.com/en-us/documentation/learning-paths/appservice-mobileapps/
