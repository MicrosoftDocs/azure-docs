---
title: Use LetsEncrypt.org certificates with Application Gateway
description: This article provides information on how to obtain a certificate from LetsEncrypt.org and use it on your Application Gateway for AKS clusters. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 08/01/2023
ms.author: greglin
---

# Use certificates with LetsEncrypt.org on Application Gateway for AKS clusters

This section configures your AKS to use [LetsEncrypt.org](https://letsencrypt.org/) and automatically obtain a TLS/SSL certificate for your domain. The certificate is installed on Application Gateway, which performs SSL/TLS termination for your AKS cluster. The setup described here uses the [cert-manager](https://github.com/jetstack/cert-manager) Kubernetes add-on, which automates the creation and management of certificates.

> [!TIP]
> Also see [What is Application Gateway for Containers?](for-containers/overview.md) currently in public preview.

Use the following steps to install [cert-manager](https://docs.cert-manager.io) on your existing AKS cluster.

1. Helm Chart

    Run the following script to install the `cert-manager` helm chart. The script performs the following actions:

    - creates a new `cert-manager` namespace on your AKS
    - creates the following CRDs: Certificate, Challenge, ClusterIssuer, Issuer, Order
    - installs cert-manager chart (from [docs.cert-manager.io)](https://cert-manager.io/docs/installation/compatibility/)

    ```bash
    #!/bin/bash

    # Install the CustomResourceDefinition resources separately
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.1/cert-manager.crds.yaml

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
      --version v1.10.1 \
      # --set installCRDs=true
     
    # To automatically install and manage the CRDs as part of your Helm release, 
    # you must add the --set installCRDs=true flag to your Helm installation command.
    ```

2. ClusterIssuer Resource

    Create a `ClusterIssuer` resource. This is required by `cert-manager` to represent the `Lets Encrypt` certificate authority where the signed certificate is obtained.

    Cert-manager uses the non-namespaced `ClusterIssuer` resource to issue certificates that can be consumed from multiple namespaces. `Let’s Encrypt` uses the ACME protocol to verify that you control a given domain name and to issue a certificate. More details on configuring `ClusterIssuer` properties [here](https://docs.cert-manager.io/en/latest/tasks/issuers/index.html). `ClusterIssuer` instructs `cert-manager` to issue certificates using the `Lets Encrypt` staging environment used for testing (the root certificate not present in browser/client trust stores).

    The default challenge type in the following YAML is `http01`. Other challenges are documented on [letsencrypt.org - Challenge Types](https://letsencrypt.org/docs/challenge-types/)

    > [!IMPORTANT] 
    > Update `<YOUR.EMAIL@ADDRESS>` in the following YAML.

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
        # ACME server URL for Let’s Encrypt’s staging environment.
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
                  class: azure/application-gateway
    EOF
    ```

3. Deploy App

    Create an Ingress resource to Expose the `guestbook` application using the Application Gateway with the Lets Encrypt Certificate.

    Ensure your Application Gateway has a public Frontend IP configuration with a DNS name (either using the default `azure.com` domain, or provision a `Azure DNS Zone` service, and assign your own custom domain). The annotation `certmanager.k8s.io/cluster-issuer: letsencrypt-staging`, which tells cert-manager to process the tagged Ingress resource.

    > [!IMPORTANT] 
    > Update `<PLACEHOLDERS.COM>` in the following YAML with your own domain (or the Application Gateway one, for example 'kh-aks-ingress.westeurope.cloudapp.azure.com')

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

    After a few seconds, you  can access the `guestbook` service through the Application Gateway HTTPS url using the automatically issued **staging** `Lets Encrypt` certificate.
    Your browser may warn you of an invalid certificate authority. The staging certificate is issued by `CN=Fake LE Intermediate X1`. This warning is an indication that the system worked as expected and you're ready for your production certificate.

4. Production Certificate

    Once your staging certificate is set up successfully, you can switch to a production ACME server:
    1. Replace the staging annotation on your Ingress resource with: `certmanager.k8s.io/cluster-issuer: letsencrypt-prod`
    1. Delete the existing staging `ClusterIssuer` you created in the previous step and create a new one by replacing the ACME server from the previous ClusterIssuer YAML with `https://acme-v02.api.letsencrypt.org/directory`

5. Certificate Expiration and Renewal

    Before the `Lets Encrypt` certificate expires, `cert-manager` automatically updates the certificate in the Kubernetes secret store. At that point, Application Gateway Ingress Controller applies the updated secret referenced in the ingress resources it's using to configure the Application Gateway.
