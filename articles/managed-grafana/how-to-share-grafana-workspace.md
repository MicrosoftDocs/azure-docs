---
title: How to share an Azure Managed Grafana instance
description: 'Azure Managed Grafana: learn how you can share access permissions and dashboards with your team and customers.' 
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to 
ms.date: 3/31/2022 
---

# How to share an Azure Managed Grafana instance

A DevOps team may build dashboards to monitor and diagnose an application or infrastructure that it manages. Likewise, a support team may use a Grafana monitoring solution for troubleshooting customer issues. In these scenarios, multiple users will be accessing one Grafana instance. Azure Managed Grafana enables such sharing by allowing you to set the custom permissions on an instance that you own. This article explains what permissions are supported and how to grant permissions to share dashboards with your internal teams or external customers.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create a Managed Grafana instance](./how-to-permissions.md).

## Supported Grafana roles

Azure Managed Grafana supports the Admin, Viewer and Editor roles:

- The Admin role provides full control of the instance including viewing, editing, and configuring data sources.
- The Editor role provides read-write access to the dashboards in the instance.
- The Viewer role provides read-only access to dashboards in the instance.

The Admin role is automatically assigned to the creator of a Grafana instance. More details on Admin, Editor, and Viewer roles can be found at [Grafana organization roles](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#compare-roles).

Grafana user roles and assignments are fully integrated with the Azure Active Directory (Azure AD). You can add any Azure AD user or security group to a Grafana role and grant them access permissions associated with that role. You can manage these permissions from the Azure portal or the command line. This section explains how to assign users to the Viewer or Editor role in the Azure portal.

> [!NOTE]
> Azure Managed Grafana doesn't support personal [Microsoft accounts](https://account.microsoft.com) (a.k.a., MSA) currently.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Assign an Admin, Viewer or Editor role to a user

1. Open your Managed Grafana instance.
1. Select **Access control (IAM)** in the navigation menu.
1. Click **Add**, then **Add role assignment**

      :::image type="content" source="media/share/iam-page.png" alt-text="Screenshot of Add role assignment in the Azure platform.":::

1. Select one of the Grafana roles to assign to a user or security group. The available roles are:

   - Grafana Admin
   - Grafana Editor
   - Grafana Viewer

    :::image type="content" source="media/share/role-assignment.png" alt-text="Screenshot of the Grafana roles in the Azure platform.":::

> [!NOTE]
> Dashboard and data source level sharing will be done from within the Grafana application. Fore more details, refer to [Grafana permissions](https://grafana.com/docs/grafana/latest/permissions/).

## Next steps

> [!div class="nextstepaction"]
> [Configure data sources](./how-to-data-source-plugins-managed-identity.md)

> [!div class="nextstepaction"]
> [Modify access permissions to Azure Monitor](./how-to-permissions.md)

> [!div class="nextstepaction"]
> [Call Grafana APIs in your automation](./how-to-api-calls.md)
