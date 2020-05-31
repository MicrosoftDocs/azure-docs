--- 
title: Automate the deployment and release of your mobile applications with Visual Studio App Center and Azure services
description: Learn about the services such as App Center that help set up continuous delivery pipeline for your mobile applications.
author: codemillmatt
ms.assetid: 34a8a070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 03/24/2020
ms.author: masoucou
---

# Automate the deployment and release of your mobile applications with continuous delivery services

As developers, you write code and check it into the code repository, but the commits checked into the repo might not always be consistent. When multiple developers work on the same project, issues can come up with integration. Teams might run into situations where things don't work, bugs pile up, and project development gets delayed. Developers have to wait until the entire software code is built and tested to check for errors, which makes the process slow and less iterative.

With continuous delivery, you automate the deployment and release of your mobile applications. It doesn't matter whether you're distributing the application to a group of testers or company employees (for beta testing) or to an app store (for production). Continuous delivery makes deployments less risky and encourages fast iterations. You can also release new changes to your customers in a continual way.

## Distribute application binaries to beta testers
Beta testing your mobile application is one of the critical steps during the application development process. It helps to find bugs and issues in your application early on. The feedback improves your application quality when you're getting it ready for production use.

Use the following services to enable a continuous delivery pipeline in your mobile apps.

### Visual Studio App Center
[App Center Distribute](/appcenter/distribution/) is a tool for developers to quickly release builds to devices. With a complete install portal experience, App Center Distribute is a powerful solution for beta app tester distribution. It's also a convenient alternative to distribution through public app stores. Developers can automate their distribution workflow even further with App Center Build and public application store integrations.

**Key features**
- Distribute your app to beta testers and users and ensure that all your testers are on the latest version of your application.
- Notify testers of new releases without testers going through the download flow again.
- Manage distribution groups for different versions of your application.
- Distribute to stores: 
    - [Apple](/appcenter/distribution/stores/apple)
    - [Google Play](/appcenter/distribution/stores/googleplay)
    - [Intune](/appcenter/distribution/stores/intune)
- Gain platform support for iOS, Android, macOS, tvOS, Xamarin, React Native, Unity, and Cordova.
- Automatically register iOS devices to your provisioning profile.

**References**
- [Sign up with Visual Studio App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
- [Get started with App Center Distribute](/appcenter/build/)

### Azure Pipelines

[Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) is a fully featured continuous integration (CI) and continuous delivery (CD) service that works with your preferred Git provider. Azure Pipelines can deploy to most major cloud services, such as Azure services. You can start with your code on GitHub, GitHub Enterprise Server, GitLab, Bitbucket Cloud, or Azure Repos. Then you can automate the build, testing, and deployment of your code to Microsoft Azure, Google Cloud Platform, or Amazon Web Services (AWS).

**Key features**
- **Simplified task-based experience for setting up a CI server:** Set up a CI server for both native (Android, iOS, and Windows) and cross-platform (Xamarin, Cordova, and React Native) mobile applications.
- **Any language, platform, and cloud:** Build, test, and deploy Node.js, Python, Java, PHP, Ruby, Go, C/C++, C#, Android, and iOS apps. Run in parallel on Linux, macOS, and Windows. Deploy to cloud providers like Azure, AWS, and Google Cloud Platform. Distribute mobile applications through beta channels and app stores.
- **Native container support:** Create new containers with ease, and push them to any registry. Deploy containers to independent hosts or Kubernetes.
- **Advanced workflows and features:** Easily create build chains and multiphased builds. Get support for YAML, test integration, release gates, reporting, and more.
- **Extensible:** Use a range of build, test, and deployment tasks built by the community, which includes hundreds of extensions from Slack to SonarCloud. You can even deploy from other CI systems, like Jenkins. Web hooks and REST APIs can help you integrate.
- **Free cloud-hosted builds:** These builds are available for public and private repositories.
- **Support for deployment to other cloud vendors:** Vendors include AWS and Google Cloud Platform.

**References**
- [Get started with Azure Pipelines guide](/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops)
- [Get started with Azure DevOps](https://app.vsaex.visualstudio.com/signup/)
  
## Distribute your application directly to App Stores
After your application is ready for production use and you want it to be used publicly, it needs to be submitted to app stores where it can be downloaded by customers. There are multiple ways to distribute your application directly to app stores. 

### Visual Studio App Center
With [App Center Distribute](/appcenter/distribution/stores/), you can publish your mobile applications directly to app stores. After your application is ready to be downloaded by users, you can publish your application binaries directly from the Visual Studio App Center portal. 

You can directly distribute to:
- [Apple App Store](/appcenter/distribution/stores/apple)
- [Google Play Store](/appcenter/distribution/stores/googleplay)
- [Microsoft Intune](/appcenter/distribution/stores/intune)
    
### Apple App Store
In the app store developed and maintained by Apple, users can browse and download applications developed for iOS, MacOS, WatchOS, and tvOS devices. Developers need to submit their iOS apps to the Apple App Store for public use.

### Google Play

Google Play is the official app store for Android OS, where users can browse and download applications developed for Android devices that are published through Google.

### Intune

[Microsoft Intune](/intune/app-management) is a cloud-based service in the enterprise mobility management space that helps to enable your workforce to be productive while keeping your corporate data protected. With Intune, you can:
- Manage the mobile devices and PCs your workforce uses to access company data.
- Manage the mobile applications your workforce uses.
- Protect your company information by controlling the way your workforce accesses and shares it.
- Ensure that devices and applications are compliant with company security requirements.
    
## Deploy updates directly to users' devices

### CodePush
With [CodePush](/appcenter/distribution/codepush/) in App Center, Apache Cordova and React Native developers can deploy mobile application updates directly to their users' devices. It acts as a central repository that developers can publish certain updates to, such as JavaScript, HTML, CSS, and image changes. Then applications can query for updates from the repository by using the provided client SDKs. In this way, you can have a more deterministic and direct engagement model with your users while you address bugs or add small features. You aren't required to rebuild a binary or redistribute it through any public app stores.

**Key features**
- Cordova and React Native developers can deploy mobile application updates directly to their users' devices without releasing on a store.
- Useful for fixing bugs or adding and removing small features that don't require you to rebuild binary and redistribute it through respective stores.

**References**
- [Sign up with Visual Studio App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
- [Get started with CodePush in App Center](/appcenter/distribution/codepush/)
- [CodePush CLI](/appcenter/distribution/codepush/cli)