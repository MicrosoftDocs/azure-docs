---
author: backwind1233
ms.author: zhihaoguo
ms.date: 06/26/2024
ms.topic: include
---

## Get a Red Hat pull secret

The Azure Marketplace offer used in this article requires a Red Hat pull secret. This section shows you how to get a Red Hat pull secret for Azure Red Hat OpenShift. To learn about what a Red Hat pull secret is and why you need it, see the [Get a Red Hat pull secret](../tutorial-create-cluster.md#get-a-red-hat-pull-secret-optional) section of [Tutorial: Create an Azure Red Hat OpenShift 4 cluster](../tutorial-create-cluster.md).

Use the following steps to get the pull secret:

1. Open the [Red Hat OpenShift Hybrid Cloud Console](https://console.redhat.com/openshift/install/azure/aro-provisioned), then use your Red Hat account to sign in to the OpenShift cluster manager portal. You may need to accept more terms and update your account as shown in the following screenshot. Use the same password as when you created the account.

   :::image type="content" source="../media/howto-deploy-java-jboss-enterprise-application-platform-app/red-hat-account-complete-profile.png" alt-text="Screenshot of Red Hat Update Your Account page." lightbox="../media/howto-deploy-java-jboss-enterprise-application-platform-app/red-hat-account-complete-profile.png":::

1. After you sign in, select **OpenShift** then **Downloads**.
1. Select the **All categories** dropdown list and then select **Tokens**.
1. Under **Pull secret**, select **Copy** or **Download** to get the value, as shown in the following screenshot.

   :::image type="content" source="../media/howto-deploy-java-jboss-enterprise-application-platform-app/red-hat-console-portal-pull-secret.png" alt-text="Screenshot of the Red Hat console portal that shows the pull secret." lightbox="../media/howto-deploy-java-jboss-enterprise-application-platform-app/red-hat-console-portal-pull-secret.png":::

   The following content is an example that was copied from the Red Hat console portal, with the auth codes replaced with `xxxx...xxx`.

   ```json
   {"auths":{"cloud.openshift.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"quay.io":{"auth":"xxx...xxx","email":"contoso-user@test.com"},"registry.connect.redhat.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"registry.redhat.io":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"}}}
   ```

1. Save the secret to a file so you can use it later.
