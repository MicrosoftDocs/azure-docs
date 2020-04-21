--- 
title: Automate the lifecycle of your apps with Visual Studio App Center and Azure services
description: Learn about the services such as App Center that help set up continuous build and integration for your mobile applications.
author: codemillmatt
ms.assetid: 34a8a070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 03/24/2020
ms.author: masoucou
---

# Automate the lifecycle of your apps with continuous build and integration

As developers, you write code and check it into the code repository, but the commits checked into the repo might not always be consistent. When multiple developers work on the same project, issues can come up with integration. Teams might run into situations where things don't work, bugs pile up, and project development gets delayed. Developers have to wait until the entire software code is built and tested to check for errors, which makes the process slow and less iterative. 

With continuous build and integration, developers can simplify builds and test their code by committing their changes to the source code repository and putting tests and verifications into the build environment. In this way, they're always running tests against their code. All the changes made to the source code are built continuously whenever there's a commit made to the repository. With every check-in, the continuous integration (CI) server validates and executes any test that the developer created. If the tests don't pass, the code is sent back for further changes. In this way, the developers don't break the builds that are created. They also don't have to run all the tests locally on their computers, which increases developer productivity. 

## Key benefits
- Automate your builds, tests, and deployments for pipelines.
- Detect bugs and fix issues early to ensure faster release rates.
- Commit code more frequently and build applications fast.
- Get flexibility to change code quickly without any issues.
- Gain faster time-to-market so that only good quality code makes it all the way through.
- Make small code changes more efficiently because small pieces of code are integrated at one time.
- Increase team transparency and accountability so that you get continuous feedback from your customers and your team.

Use the following services to enable a continuous integration pipeline in your mobile apps.

## Visual Studio App Center
[App Center Build](/appcenter/build/) helps you build native and cross-platform applications that your team is working on by using a secure cloud infrastructure. You can easily connect your repo in Visual Studio App Center and start building your app in the cloud on every commit. You don't have to worry about configuring build servers locally, complicated configurations, and code that builds on a coworker's machine but not yours.

With the added power of Visual Studio App Center services, you can further automate your workflow. You can automatically release builds to testers and public app stores with App Center Distribute. You also can run automated UI tests on thousands of real device and OS configurations in the cloud with App Center Test.

**Key features**
- Set up continuous integration in minutes, and build applications more frequently and faster.
- Integrate with GitHub, BitBucket, Azure DevOps, and GitLab.
- Create fast and secure builds on managed, cloud-hosted machines.
- Enable your builds to launch test, and verify whether the app builds in real-world iOS and Android devices.
- Gain native and cross-platform support for iOS, Android, macOS, Windows, Xamarin, and React Native.
- Customize your builds by adding post-clone, pre-build, and post-build scripts.

**References**
- [Sign up with Visual Studio App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
- [Get started with App Center Build](/appcenter/build/)

## Azure Pipelines
 [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/), a service in Azure DevOps, is a fully featured continuous integration and continuous delivery (CD) service that works with your preferred Git provider. It can deploy to most major cloud services, which includes Azure. You can start with your code on GitHub, GitHub Enterprise Server, GitLab, Bitbucket Cloud, or Azure Repos. Then you can automate the build, testing, and deployment of your code to Microsoft Azure, Google Cloud Platform, or Amazon Web Services (AWS).

**Key features**
- **Simplified task-based experience for setting up a CI server:** Set up a CI server for both native (Android, iOS, and Windows) and cross-platform (Xamarin, Cordova, and React Native) mobile applications, in addition to Microsoft and non-Microsoft (Node.js, Java)-based server technologies.
- **Any language, platform, and cloud:** Build, test, and deploy Node.js, Python, Java, PHP, Ruby, Go, C/C++, C#, Android, and iOS applications. Run in parallel on Linux, macOS, and Windows. Deploy to cloud providers like Azure, AWS, and Google Cloud Platform. Distribute mobile applications through beta channels and app stores.
- **Native container support:** Create new containers with ease, and push them to any registry. Deploy containers to independent hosts or Kubernetes.
- **Advanced workflows:** Easily create build chains and multiphased builds. Get support for YAML, test integration, release gates, reporting, and more.
- **Extensible:** Use a range of build, test, and deployment tasks built by the community, which includes hundreds of extensions from Slack to SonarCloud. You can even deploy from other CI systems, like Jenkins. Web hooks and REST APIs can help you integrate.
- **Free cloud-hosted builds:** These builds are available for public and private repositories.
- **Support for deployment to other cloud vendors:** Vendors include AWS and Google Cloud Platform.

**References**
- [Get started with Azure Pipelines guide](/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops)
- [Get started with Azure DevOps](https://app.vsaex.visualstudio.com/signup/) 
- [Quickstarts](/azure/devops/pipelines/create-first-pipeline?view=azure-devops&tabs=tfs-2018-2)

To help you choose the right service for your application builds, see the article that compares [App Center Build vs. Azure Pipelines](/appcenter/build/choose-between-services).
