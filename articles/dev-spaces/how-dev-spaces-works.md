---
title: "How Azure Dev Spaces works"
services: azure-dev-spaces
ms.date: 06/02/2020
ms.topic: "conceptual"
description: "Describes the processes that power Azure Dev Spaces"
keywords: "Azure Dev Spaces, Dev Spaces, Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
---

# How Azure Dev Spaces works

Developing a Kubernetes application can be challenging. You need Docker and Kubernetes configuration files. You need to figure out how to test your application locally and interact with other dependent services. You might need to handle developing and testing multiple services at once and with a team of developers.

Azure Dev Spaces provides you with multiple ways to rapidly iterate and debug Kubernetes applications and collaborate with your team. This article describes what Azure Dev Spaces can do and how it works.

## Rapidly iterate and debug your Kubernetes application

Azure Dev Spaces reduces the effort to develop, test, and iterate your Kubernetes application in the context of your AKS cluster. This reduction in effort allows developers to focus on the business logic of their applications and not configuring their services to run in Kubernetes.

### Local Process with Kubernetes

With Local Process with Kubernetes, you can connect your development computer to your Kubernetes cluster, allowing you to run and debug code on your development computer as if it were running on the cluster. Azure Dev Spaces redirects traffic between your connected cluster by running a pod on your cluster that acts as a remote agent to redirect traffic between your development computer and the cluster. This traffic redirection allows code on your development computer and services running in your cluster to communicate as if they were in the same cluster. For more information about connecting your development computer to a Kubernetes cluster, see [How Local Process with Kubernetes works][how-it-works-local-process-kubernetes].

### Run your code in AKS

In addition to redirecting traffic between your development computer and your AKS cluster, with Azure Dev Spaces you can configure and quickly run your code directly in AKS. With Visual Studio, Visual Studio Code, or the Azure Dev Spaces CLI, Azure Dev spaces will upload your code to cluster, then build and run it. Azure Dev spaces can also intelligently sync code changes and restart your service to reflect changes as necessary. While running your code, build logs and HTTP traces are streamed back to your client so you can monitor progress and diagnose any issues. You can also use Azure Dev Spaces, to attach the debugger in Visual Studio and Visual Studio Code to Java, Node.js, and .NET Core services. For more information, see [How preparing a project for Azure Dev Spaces works][how-it-works-prep], [How running your code with Azure Dev Spaces works][how-it-works-up], and [How remote debugging your code with Azure Dev Spaces works][how-it-works-remote-debugging].

## Team development

Azure Dev Spaces helps teams productively work on their application on the same AKS cluster without being disruptive.

### Intelligent routing between dev spaces

With Azure Dev Spaces, a team can share a single AKS cluster running a cloud-native application and create isolated dev spaces where the team can develop, test, and debug without interfering with the other dev spaces. A baseline version of the application runs in a root dev space. Team members then create independent child dev spaces based on the root space for development, testing, and debugging changes to the application. Through the routing capabilities in Dev Spaces, child dev spaces can route requests between services running in the child dev space and the parent dev space. This routing allows developers to run their own version of a service while reusing dependent services from the parent space. Each child space has its own unique URL, which can be shared and accessed by others for collaboration. For more information on how routing works in Azure Dev Spaces, see [How routing works with Azure Dev Spaces][how-it-works-routing].

### Live testing an open pull request

You can also use GitHub Actions with Azure Dev Spaces to test changes to your application in a pull request directly in your cluster before merging. Azure Dev Spaces can automatically deploy a review version of the application to your cluster, allowing the author as well as other team members to review the changes in the context of the entire application. Using the routing capabilities of Azure Dev Spaces, this review version of the application is also deployed to your cluster without impacting other dev spaces. All of these capabilities allow you to confidently approve and merge pull requests. To see an example of GitHub Actions and Azure Dev Spaces, see [GitHub Actions & Azure Kubernetes Service][pr-flow].

## Next steps

To get started connecting your local development computer to your AKS cluster, see [Connect your development computer to an AKS cluster][connect].

To get started using Azure Dev Spaces for team development, see the [team development in Azure Dev Spaces][quickstart-team] quickstart.

[connect]: how-to/local-process-kubernetes-vs-code.md
[how-it-works-local-process-kubernetes]: how-dev-spaces-works-local-process-kubernetes.md
[how-it-works-prep]: how-dev-spaces-works-prep.md
[how-it-works-remote-debugging]: how-dev-spaces-works-remote-debugging.md
[how-it-works-routing]: how-dev-spaces-works-routing.md
[how-it-works-up]: how-dev-spaces-works-up.md
[pr-flow]: how-to/github-actions.md
[quickstart-team]: quickstart-team-development.md
[routing]: #team-development