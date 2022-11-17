---
title: Custom domain names and certificates in Azure Container Apps
description: Learn to manage custom domain names and certificates in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 06/07/2022
ms.author: cshoe
---

# Custom domain names and certificates in Azure Container Apps

Azure Container Apps allows you to bind one or more custom domains to a container app.

- Every domain name must be associated with a domain certificate.
- Certificates are applied to the container app environment and are bound to individual container apps. You must have role-based access to the environment to add certificates.
- [SNI domain certificates](https://wikipedia.org/wiki/Server_Name_Indication) are required.
- Ingress must be enabled for the container app

## Add a custom domain and certificate

> [!IMPORTANT]
> If you are using a new certificate, you must have an existing [SNI domain certificate](https://wikipedia.org/wiki/Server_Name_Indication) file available to upload to Azure.  

1. Navigate to your container app in the [Azure portal](https://portal.azure.com)

1. Verify that your app has ingress enabled by selecting **Ingress** in the *Settings* section.  If ingress is not enabled, enable it with these steps:

   1. Set *HTTP Ingress* to **Enabled**.
   1. Select the desired *Ingress traffic* setting.
   1. Enter the *Target port*.
   1. Select **Save**.

1. Under the *Settings* section, select **Custom domains**.

1. Select the **Add custom domain** button.

1. In the *Add custom domain* window, enter the following values for the *Enter domain* tab:

    | Setting | Value | Notes |
    |--|--|--|
    | Domain | Enter your domain name. | Make sure the value is just the domain without the protocol. For instance, `example.com`, or `www.example.com`. |
    | Hostname record type | Verify the default value. | The value selected automatically is Azure's best guess based on the form of the domain name you entered. For an apex domain, the value should be an `A` record, for a subdomain the value should be `CNAME`. |

1. Next, you need to add the DNS records shown on this window to your domain via your domain provider's website. Open a new browser window to add the DNS records and return here once you're finished.

1. Once the required DNS records are created on your domain provider's account, select the **Validate** button.

1. Once validation succeeds, select the **Next** button.

1. On the *Bind certificate + add* tab, enter the following values:

    | Setting | Value | Notes |
    |--|--|--|
    | Certificate | Select an existing certificate from the list, or select the **Create new** link. | If you create a new certificate, a window appears that allows you to select a certificate file from your local machine. Once you select a certificate file, you're prompted to add the certificate password. |

    Once you select a certificate, the binding operation may take up to a minute to complete.

Once the add operation is complete, you see your domain name in the list of custom domains.

> [!NOTE]
> For container apps in internal Container Apps environments, [additional configuration](./networking.md#dns) is required to use custom domains with VNET-scope ingress.

## Managing certificates

You can manage certificates via the Container Apps environment or through an individual container app.

### Environment

The *Certificates* window of the Container Apps environment presents a table of all the certificates associated with the environment.

You can manage your certificates through the following actions:

| Action | Description |
|--|--|
| Add | Select the **Add certificate** link to add a new certificate. |
| Delete | Select the trash can icon to remove a certificate.  |
| Renew | The *Health status* field of the table indicates that a certificate is expiring soon within 60 days of the expiration date. To renew a certificate, select the **Renew certificate** link to upload a new certificate. |

### Container app

The *Custom domains* window of the container app presents a list of custom domains associated with the container app.

You can manage your certificates for an individual domain name by selecting the ellipsis (**...**) button, which opens the certificate binding window. From the following window, you can select a certificate to bind to the selected domain name.

## Next steps

> [!div class="nextstepaction"]
> [Authentication in Azure Container Apps](authentication.md)
