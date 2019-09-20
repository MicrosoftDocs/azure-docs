--- 
title: Continuous Integration Services
description: Learn how to set up continuous build and integration for your mobile apps
author: elamalani

ms.assetid: 34a8a070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 08/21/2019
ms.author: emalani
---

# Continuous Delivery

As developers, you write code and check it in into the code repository but the commits checked into the repo might not be always consistent. With multiple developers working on the same project, issues come up with integration and the team would run into situations where things are not working, bugs keep piling up, and project development gets delayed. Developers have to wait till the entire software code is built and tested to check for errors and this makes the process slow and less iterative.

With **Continuous Delivery**, you automate the deployment and release of your mobile apps, regardless of whether you’re distributing the application to a group of testers or company employees (for beta testing), or the App Store (for production). It makes the deployments less risky, ecnourages fast iterations, and let's you release new changes to your customers in a continual way.

# Distribute application binaries to beta testers
Beta testing your mobile application is one of the critical step during the app development process. It helps to find bugs and issues in your app early on and the feedback that improves your app quality getting it ready for production use.

## Services

1. ### **Visual Studio App Center**
    [App Center Distribute](https://docs.microsoft.com/en-us/appcenter/distribution/) is a tool for developers to quickly release builds to end user devices. With a complete install portal experience, Distribute is not only a powerful solution for beta app tester distribution but also a convenient alternative to distribution through the public App Stores. Developers can automate their distribution workflow even further with App Center Build and public app store integrations.

    **Key Features**
    - **Distribute your app to beta testers and users** and ensure all your testers are on the latest version of your app.
    - **Notify testers of new releases** without testers going through the download flow again. 
    - **Manage distribution groups** for different versions of your app.
    - **Distribution to Stores** - [Apple](https://docs.microsoft.com/en-us/appcenter/distribution/stores/apple), [Google Play](https://docs.microsoft.com/en-us/appcenter/distribution/stores/googleplay), and [Intune](https://docs.microsoft.com/en-us/appcenter/distribution/stores/intune).
    - **Platform Support** - iOS, Android, macOS, tvOS, Xamarin, React Native, Unity, Cordova.
    - Automatically register iOS devices to your provisioning profile.

    **References**
    - [App Center portal](https://appcenter.ms) 
    - [Get started with App Center Distribute](https://docs.microsoft.com/en-us/appcenter/build/)

2. ### **Azure Pipelines**

    [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) is a fully featured continuous integration (CI) and continuous delivery (CD) service that works with your preferred Git provider and can deploy to most major cloud services, which include Azure services. You can start with your code on GitHub, GitHub Enterprise Server, GitLab, Bitbucket Cloud, or Azure Repos. Then you can automate the build, testing, and deployment of your code to Microsoft Azure, Google Cloud Platform, or Amazon Web Services.

    **Key Features**
    - Simplified task-based experience for setting up a CI server for both **native (Android, iOS, and Windows) and cross-platform (Xamarin, Cordova,and React Native) mobile apps**.
    - **Any language, platform, and cloud** - Build, test, and deploy Node.js, Python, Java, PHP, Ruby, Go, C/C++, C#, Android, and iOS apps. Run in parallel on Linux, macOS, and Windows. Deploy to cloud providers like Azure, AWS, and GCP. Distribute mobile apps through beta channels and app stores.
    - **Native Container support** - Create new containers with ease and push them to any registry. Deploy containers to independent hosts or Kubernetes.
    - **Advanced workflows and features** - Easy build chaining and multi-phased builds. Support for YAML, test integration, release gates, reporting, and more.
    - **Extensible** - Use a range of build, test, and deployment tasks built by the community – hundreds of extensions from Slack to SonarCloud. You can even deploy from other CI systems, like Jenkins. Webhooks and REST APIs help you integrate.
    - **Free cloud-hosted builds** for public and private repositories.
    - **Supports Deployment to other cloud vendors** like AWS , GCP etc.

    **References**
  - [Get started with Azure Pipelines guide](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops)
  - [Get started with Azure DevOps](https://app.vsaex.visualstudio.com/signup/) 
  
# Distribute your application directly to App Stores
Once your application is ready for production use and you want it to be used publicly, it needs to be submitted to App Stores from where it can be downloaded by customers. There are multiple ways to distribute your application directly to App Stores. 

## Services

1. ### **Visual Studio App Center**

    [App Center Distribute](https://docs.microsoft.com/en-us/appcenter/distribution/stores/) service lets you publish your mobile apps directly to App Stores. Once your app is ready to be downloaded by end users, you can publish your app binaries directly from the App Center portal.  

    You can directly distribute to:
    - [Apple App Store](https://docs.microsoft.com/en-us/appcenter/distribution/stores/apple)
    - [Google Play Store](https://docs.microsoft.com/en-us/appcenter/distribution/stores/googleplay)
    - [Micrsoft Intune](https://docs.microsoft.com/en-us/appcenter/distribution/stores/intune)
    
2. ### **Apple App Store**

    The App Store developed and maintained by Apple allows users to browse and download apps developed with Apple's iOS SDK. Developers need to submit their iOS apps to Apple Store for public use. 

3. ### **Google Play**

    Google Play is the official app store for Android OS, allowing users to browse and downloa applications developer with Android SDK and published throught Google. 

4. ### **Intune**

    [Microsoft Intune](https://docs.microsoft.com/en-us/intune/app-management) is a cloud-based service in the enterprise mobility management (EMM) space that helps enable your workforce to be productive while keeping your corporate data protected. With Intune, you can 
    - Manage the mobile devices and PCs your workforce uses to access company data
    - Manage the mobile apps your workforce uses
    - Protect your company information by helping to control the way your workforce accesses and shares it
    - Ensure devices and apps are compliant with company security requirements
    
# Deploy updates directly to users' devices

## Services

1. ### **CodePush**

    [CodePush](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/) service in App Center enables Apache Cordova and React Native developers to deploy mobile app updates directly to their users’ devices. It works by acting as a central repository that developers can publish certain updates to (e.g. JS, HTML, CSS and image changes), and that apps can query for updates from (using the provided client SDKs). This allows you to have a more deterministic and direct engagement model with your end-users, while addressing bugs and/or adding small features that don’t require you to re-build a binary and/or re-distribute it through any public app stores.

    **Key Features**
    - Allows Cordova and React Native developers to deploy mobile app updates directly to their user’s devices without help of Store.
    - Useful for fixing bugs or adding/removing small features that don’t require to rebuild binary and redistribute through respective stores.
    
    **References**
    - [App Center portal](https://appcenter.ms) 
    - [Get started with Code Push in App Center](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)
    - [CodePush CLI](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli)