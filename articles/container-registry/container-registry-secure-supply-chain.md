---
title: Secure Supply Chain for the Containers
description: Understanding the Secure Supply Chain phases for the Containers.
author: tejaswikolli-web
ms.author: tejaswikolli
ms.topic: overview 
ms.date: 09/2/2022
ms.custom: template-overview 
---

# The Secure Supply Chain Management for the Containers

The Microsoft Supply Chain is a seamless, agile ecosystem to provide a secure life cycle process and an isolated environment for the containers. Learn more about [how-containers-work][how-containers-work].

## Container Secure Supply Chain phases

The Containers Secure Supply Chain has many tools and services in place, as well as a visible end to end process of securing the containers at each phase and delivering the immutable container infrastructure.

The Container Secure Supply Chain phases are as follows:

1. Acquire
1. Host
1. Build
1. Deploy
1. Run

## Acquire

The early phase of the Container Secure Supply Chain is Acquire. In this phase we acquire container images from multiple trusted sources. The container images come from the Public, Private, and non-Azure Sources. For example, Docker Hub, Same or a Different Azure subscription or tenant, Microsoft Container Registry, etc. 

Microsoft Security objective is as follows:

>* Verify the source of the container image is trustworthy.
>* Verify the providence of the container image. 
>* Verify the validity and access controls on the container image.

Acquiring container images from multiple sources means acquiring container images with different sizes, client environments, and architectures. Microsoft Secure Supply chain has services and components in place to set controls and verify the source of each and every container image import.

Once the images verify as trustworthy the gateway will allow them to the Host phase of the Secure Supply Chain to host the container images coming from trusted sources.

## Host

Container images may come from trusted sources but they still carry the risk of vulnerabilities and malware attached to them. The next phase of the secure supply chain hosts the trusted container images before approving them for the internal use. 

Microsoft Security objective is as follows:

>* Verify the trusted container images is free of Malware.
>* Verify the vulnerability scans of the trusted container images.
>* Verify the meta-data of the trusted container images is enriching and allows the policy decisions.

Hosting the trusted container images determines the condition and evaluates the capability of the trusted container image. Once the quality assurance is complete on the base container image, the verified and trusted container images are ready for the internal use.

The gateway will only build the trusted and verified container images.

## Build

Once the trusted and verified container image is ready for the internal use, we direct these images to the Build phase of the Secure Supply Chain. During the Build phase, we re-architect the base container image by adding dependencies, libraries, or additional framework patches creating a resulting containers.

Microsoft Security objective is as follows:

>* Verify the base container images are compliant to the Organizational policy and standards.
>* Verify the base container images are compliant to the Application policy and standards.
>* Verify the vulnerability posture of the trusted and verified base container images.

The build integrates the trusted and verified base container image with the added packages. The resulting container and its reference artifact must be complaint with both Application and Organizational security policies.

The gateway will only Deploy the container and its reference artifact that are secure, and compliant with Application and Organizational policies.

## Deploy

The container and reference artifacts gets ready for the next phase of Secure Supply Chain, which is Deploy. The Secure Supply Chain continuously monitors the containers and its reference artifacts for reliability and performance. The goal here's to ensure every container image and its reference artifacts are compliant to the enterprise security policies.

Microsoft Security objective is as follows:

>* Verify the containers and the reference artifacts are secured, verified, and compliant.
>* Verify the containers and the reference artifacts are active, valid, and ready to use.
>* Verify the continuos monitoring and event tracking for the containers and the reference artifacts is enabled.


Each and every container and its reference artifacts are continuously monitored for avoiding any insecure and non-verified images. The Secure Supply Chain has services to ensure each container are active, usable. Only the verified and secured containers and its reference artifacts are ready for the deployment.

The gateway will only Run the container and its reference artifact that are secure, active, valid, and compliant with Application and Organizational policies.

## Run

Once deployed the containers and reference artifacts are in the last phase of Secure Supply Chain, which is Run. During the phase, the containers and reference artifacts are continuously monitored through logs. The goal here's to remove any containers that are invalid and not compliant with the security policies. 

Microsoft Security objective is as follows:

>* Verify and remove the insecure containers and the reference artifacts.
>* Verify the continuos scanning for vulnerability and validity is enabled.
>* Verify the security policy controls on the containers and the reference artifacts.
>* Verify the logs for the containers and the reference artifacts.
>* Verify the access controls while distributing.

These immutable containers and its reference artifacts are continuously monitored to ensure they're free from vulnerability, malware and actively usable. The supply chain further ensures to place controls on who can access these containers and its reference artifacts.

The gateway will only allow distributing the container and its reference artifact with a valid access.

<!-- LINKS - Internal -->
[how-containers-work]: https://learn.microsoft.com/virtualization/windowscontainers/about/#how-containers-work