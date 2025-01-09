---
title: Use Let's Encrypt certificates with Application Gateway
description: This article provides information on how to obtain a certificate from Let's Encrypt and use it on your Application Gateway deployment for AKS clusters.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 08/01/2023
ms.author: greglin
---

# Use Let's Encrypt certificates on Application Gateway for AKS clusters

You can configure your Azure Kubernetes Service (AKS) instance to use [Let's Encrypt](https://letsencrypt.org/) and automatically obtain a TLS/SSL certificate for your domain. The certificate is installed on Azure Application Gateway, which performs TLS/SSL termination for your AKS cluster.

The setup that this article describes uses the [cert-manager](https://github.com/jetstack/cert-manager) Kubernetes add-on, which automates the creation and management of certificates.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution.

## Install the add-on

Use the following steps to install [cert-manager](https://docs.cert-manager.io) on your existing AKS cluster:

1. Run the following script to install the cert-manager Helm chart. The script performs the following actions:

    - Creates a new `cert-manager` namespace on your AKS cluster
    - Creates the following custom resource definitions (CRDs): `Certificate`, `Challenge`, `ClusterIssuer`, `Issuer`, `Order`
    - Installs the cert-manager chart (from the [cert-manager site](https://cert-manager.io/docs/installation/compatibility/))

    ```bash
    #!/bin/bash

    # Install the CustomResourceDefinition resources separately
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.1/cert-manager.crds.yaml

    # Create the namespace for cert-manager
    kubectl create namespace cert-manager

    # Label the cert-manager namespace to disable resource validation
    kubectl label namespace cert-manager cert-manager.io/disable-validation=true

    # Add the Jetstack Helm repository
    helm repo add jetstack https://charts.jetstack.io

    # Update your local Helm chart repository cache
    helm repo update

    # Install the cert-manager Helm chart
    # Helm v3+
    helm install \
      cert-manager jetstack/cert-manager \
      --namespace cert-manager \
      --version v1.16.1 \
      # --set installCRDs=true

    # To automatically install and manage the CRDs as part of your Helm release,
    # you must add the --set installCRDs=true flag to your Helm installation command.
    ```

2. Create a `ClusterIssuer` resource. Cert-manager requires this resource to represent the Let's Encrypt certificate authority that issues the signed certificate.

    Cert-manager uses the non-namespaced `ClusterIssuer` resource to issue certificates that can be consumed from multiple namespaces. Let's Encrypt uses the ACME protocol to verify that you control a particular domain name and to issue a certificate. You can get more details on configuring `ClusterIssuer` properties in the [cert-manager documentation](https://docs.cert-manager.io/en/latest/tasks/issuers/index.html).

    `ClusterIssuer` instructs cert-manager to issue certificates by using the Let's Encrypt staging environment that's used for testing. (The root certificate is not present in browser/client trust stores.)

    The default challenge type in the following YAML is `http01`. You can find other challenge types in the [Let's Encrypt documentation](https://letsencrypt.org/docs/challenge-types/).

    In the following YAML, be sure to replace `<YOUR.EMAIL@ADDRESS>` with your information.

    ```bash
    #!/bin/bash
    kubectl apply -f - <<EOF
    apiVersion: cert-manager.io/v1
    kind: ClusterIssuer
    metadata:
      name: letsencrypt-staging
    spec:
      acme:
        # You must replace this email address with your own.
        # Let's Encrypt uses this to contact you about expiring
        # certificates, and issues related to your account.
        email: <YOUR.EMAIL@ADDRESS>
        # ACME server URL for Let's Encrypt's staging environment.
        # The staging environment won't issue trusted certificates but is
        # used to ensure that the verification process is working properly
        # before moving to production
        server: https://acme-staging-v02.api.letsencrypt.org/directory
        privateKeySecretRef:
          # Secret resource used to store the account's private key.
          name: example-issuer-account-key
        # Enable the HTTP-01 challenge provider
        # you prove ownership of a domain by ensuring that a particular
        # file is present at the domain
        solvers:
          - http01:
            ingress:
             #   class: azure/application-gateway
               ingressTemplate:
                 metadata:
                   annotations:
                     kubernetes.io/ingress.class: azure/application-gateway
    EOF
    ```

3. Create an ingress resource to expose the `guestbook` application by using the Application Gateway deployment with the Let's Encrypt certificate.

    Ensure that your Application Gateway deployment has a public frontend IP configuration with a DNS name. Use the default `azure.com` domain, or provision an Azure DNS zone and then assign your own custom domain. The annotation `certmanager.k8s.io/cluster-issuer: letsencrypt-staging` tells cert-manager to process the tagged ingress resource.

    In the following YAML, be sure to replace `<PLACEHOLDERS.COM>` with your own domain or with the Application Gateway domain (for example, `kh-aks-ingress.westeurope.cloudapp.azure.com`).

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: guestbook-letsencrypt-staging
      annotations:
        kubernetes.io/ingress.class: azure/application-gateway
        cert-manager.io/cluster-issuer: letsencrypt-staging
    spec:
      tls:
      - hosts:
        - <PLACEHOLDERS.COM>
        secretName: guestbook-secret-name
      rules:
      - host: <PLACEHOLDERS.COM>
          http:
          paths:
          - backend:
              serviceName: frontend
              servicePort: 80
    EOF
    ```

    After a few seconds, you  can access the `guestbook` service through the Application Gateway HTTPS URL by using the automatically issued Let's Encrypt certificate for staging.

    Your browser might warn you about an invalid certificate authority. The reason is that `CN=Fake LE Intermediate X1` issued the staging certificate. This warning means that the system worked as expected and you're ready for your production certificate.

4. After you successfully set up your staging certificate, you can switch to a production ACME server:

    1. Replace the staging annotation on your ingress resource with `cert-manager.io/cluster-issuer: letsencrypt-prod`.
    1. Delete the existing staging `ClusterIssuer` resource that you created earlier. Create a new staging resource by replacing the ACME server from the previous `ClusterIssuer` YAML with `https://acme-v02.api.letsencrypt.org/directory`.

Before the Let's Encrypt certificate expires, `cert-manager` automatically updates the certificate in the Kubernetes secret store. At that point, the Application Gateway Ingress Controller applies the updated secret referenced in the ingress resources that it's using to configure Application Gateway.

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
