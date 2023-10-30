---
title: Introduction to identity
description:  Learn the fundamental concepts of identity and access management (IAM).  Learn about identities, resources, authentication, authorization, permissions, identity providers, and more.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.date: 06/05/2023
ms.author: ryanwi
ms.reviewer: 
---

# Identity and access management (IAM) fundamental concepts

This article provides fundamental concepts and terminology to help you understand identity and access management (IAM).

## What is identity and access management (IAM)?

Identity and access management ensures that the right people, machines, and software components get access to the right resources at the right time. First, the person, machine, or software component proves they're who or what they claim to be.  Then, the person, machine, or software component is allowed or denied access to or use of certain resources.

Here are some fundamental concepts to help you understand identity and access management:

## Identity

A digital identity is a collection of unique identifiers or attributes that represent a human, software component, machine, asset, or resource in a computer system. An identifier can be:
- An email address
- Sign-in credentials (username/password)
- Bank account number
- Government issued ID
- MAC address or IP address

Identities are used to authenticate and authorize access to resources, communicate with other humans, conduct transactions, and other purposes.

At a high level, there are three types of identities:  

- **Human identities** represent people such as employees (internal workers and front line workers) and external users (customers, consultants, vendors, and partners).
- **Workload identities** represent software workloads such as an application, service, script, or container.
- **Device identities** represent devices such as desktop computers, mobile phones, IoT sensors, and IoT managed devices. Device identities are distinct from human identities.

## Authentication

Authentication is the process of challenging a person, software component, or hardware device for credentials in order to verify their identity, or prove they're who or what they claim to be. Authentication typically requires the use of credentials (like username and password, fingerprints, certificates, or one-time passcodes). Authentication is sometimes shortened to *AuthN*.

Multi-factor authentication (MFA) is a security measure that requires users to provide more than one piece of evidence to verify their identities, such as:
- Something they know, for example a password.
- Something they have, like a badge or [security token](../develop/security-tokens.md).
- Something they are, like a biometric (fingerprint or face).

Single sign-on (SSO) allows users to authenticate their identity once and then later silently authenticate when accessing various resources that rely on the same identity. Once authenticated, the IAM system acts as the source of identity truth for the other resources available to the user. It removes the need for signing on to multiple, separate target systems.

## Authorization

Authorization validates that the user, machine, or software component has been granted access to certain resources.  Authorization is sometimes shortened to *AuthZ*.

## Authentication vs. authorization

The terms authentication and authorization are sometimes used interchangeably, because they often seem like a single experience to users. They're actually two separate processes: 
- Authentication proves the identity of a user, machine, or software component. 
- Authorization grants or denies the user, machine, or software component access to certain resources.  

:::image type="content" source="./media/identity-fundamentals/authentication-vs-authorization.svg" alt-text="Diagram that shows authentication and authorization side by side." :::

Here's a quick overview of authentication and authorization:

| Authentication | Authorization |
| ------- | -------- |
| Can be thought of as a gatekeeper, allowing access only to those  who provide valid credentials. | Can be thought of as a guard, ensuring that only those with the proper clearance can enter certain areas. |
| Verifies whether a user, machine, or software is who or what they claim to be.| Determines if the user, machine, or software is allowed to access a particular resource. |
| Challenges the user, machine, or software for verifiable credentials (for example, passwords, biometric identifiers, or certificates).| Determines what level of access a user, machine, or software has.|
| Done before authorization. | Done after successful authentication. |
| Information is transferred in an ID token. | Information is transferred in an access token. |
| Often uses the OpenID Connect (OIDC) (which is built on the OAuth 2.0 protocol) or SAML protocols. | Often uses the OAuth 2.0 protocol. |

For more detailed information, read [Authentication vs. authorization](../develop/authentication-vs-authorization.md).

### Example

Suppose you want to spend the night in a hotel.  You can think of authentication and authorization as the security system for the hotel building. Users are people who want to stay at the hotel, resources are the rooms or areas that people want to use.  Hotel staff is another type of user.

If you're staying at the hotel, you first go to reception to start the "authentication process". You show an identification card and credit card and the receptionist matches your ID against the online reservation. After the receptionist has verified who you are, the receptionist grants you permission to access the room you've been assigned.  You're given a keycard and can go now to your room.

:::image type="content" source="./media/identity-fundamentals/hotel-authentication.png" alt-text="Diagram that shows a person showing identification to get a hotel keycard." :::

The doors to the hotel rooms and other areas have keycard sensors.  Swiping the keycard in front of a sensor is the "authorization process". The keycard only lets you open the doors to rooms you're permitted to access, such as your hotel room and the hotel exercise room. If you swipe your keycard to enter any other hotel guest room, your access is denied.  

Individual [permissions](./users-default-permissions.md?context=/active-directory/roles/context/ugr-context), such as accessing the exercise room and a specific guest room, are collected into [roles](../roles/concept-understand-roles.md) which can be granted to individual users.  When you're staying at the hotel, you're granted the Hotel Patron role.  Hotel room service staff would be granted the Hotel Room Service role.  This role permits access to all hotel guest rooms (but only between 11am and 4pm), the laundry room, and the supply closets on each floor.

:::image type="content" source="./media/identity-fundamentals/hotel-authorization.png" alt-text="Diagram that shows a user getting access to a room with a keycard." :::

## Identity provider

An identity provider creates, maintains, and manages identity information while offering authentication, authorization, and auditing services.

:::image type="content" source="./media/identity-fundamentals/identity-provider.png" alt-text="Diagram that shows an identity icon surrounded by cloud, workstation, mobile, and database icons." :::

With modern authentication, all services, including all authentication services, are supplied by a central identity provider. Information that's used to authenticate the user with the server is stored and managed centrally by the identity provider.

With a central identity provider, organizations can establish authentication and authorization policies, monitor user behavior, identify suspicious activities, and reduce malicious attacks.  

[Microsoft Entra ID](../index.yml) is an example of a cloud-based identity provider. Other examples include Twitter, Google, Amazon, LinkedIn, and GitHub.

## Next steps

- Read [Introduction to identity and access management](introduction-identity-access-management.md) to learn more.
- Learn about [Single sign-on (SSO)](../manage-apps/what-is-single-sign-on.md).
- Learn about [Multi-factor authentication (MFA)](../authentication/concept-mfa-howitworks.md).
