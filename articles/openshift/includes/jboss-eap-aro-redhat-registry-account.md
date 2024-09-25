---
author: backwind1233
ms.author: zhihaoguo
ms.date: 06/26/2024
ms.topic: include
---

## Create a Red Hat Container Registry service account

Later, this article shows you how to manually deploy an application to OpenShift using Source-to-Image (S2I). A Red Hat Container Registry service account is necessary to pull the container image for JBoss EAP on which to run your application. If you have a Red Hat Container Registry service account ready to use, skip this section and move on to the next section, where you deploy the offer.

Use the following steps to create a Red Hat Container Registry service account and get its username and password. For more information, see [Creating Registry Service Accounts](https://access.redhat.com/RegistryAuthentication#creating-registry-service-accounts-6) in the Red Hat documentation.

1. Use your Red Hat account to sign in to the [Registry Service Account Management Application](https://access.redhat.com/terms-based-registry/).
1. From the **Registry Service Accounts** page, select **New Service Account**.
1. Provide a name for the Service Account. The name is prepended with a fixed, random string.
   - Enter a description.
   - Select **create**.
1. Navigate back to your Service Accounts.
1. Select the Service Account you created.
   - Note down the **username**, including the prepended string (that is, `XXXXXXX|username`). Use this username when you sign in to `registry.redhat.io`.
   - Note down the **password**. Use this password when you sign in to `registry.redhat.io`.

You created your Red Hat Container Registry service account.