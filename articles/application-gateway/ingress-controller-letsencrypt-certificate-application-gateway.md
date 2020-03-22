---
title: Use LetsEncrypt.org certificates with Application Gateway
description: This article provides information on how to obtain a certificate from LetsEncrypt.org and use it on your Application Gateway for AKS clusters. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 11/4/2019
ms.author: caya
---

# Use certificates with LetsEncrypt.org on Application Gateway for AKS clusters

This section configures your AKS to leverage [LetsEncrypt.org](https://letsencrypt.org/) and automatically obtain a
TLS/SSL certificate for your domain. The certificate will be installed on Application Gateway, which will perform
SSL/TLS termination for your AKS cluster. The setup described here uses the
[cert-manager](https://github.com/jetstack/cert-manager) Kubernetes add-on, which automates the creation and management of certificates.

Follow the steps below to install [cert-manager](https://docs.cert-manager.io) on your existing AKS cluster.

1. Helm Chart

    Run the following script to install the `cert-manager` helm chart. This will:

    - create a new `cert-manager` namespace on your AKS
    - create the following CRDs: Certificate, Challenge, ClusterIssuer, Issuer, Order
    - install cert-manager chart (from [docs.cert-manager.io)](https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html#steps)

    ```bash
    #!/bin/bash

    # Install the CustomResourceDefinition resources separately
    kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml

    # Create the namespace for cert-manager
    kubectl create namespace cert-manager

    # Label the cert-manager namespace to disable resource validation
    kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true

    # Add the Jetstack Helm repository
    helm repo add jetstack https://charts.jetstack.io

    # Update your local Helm chart repository cache
    helm repo update

    # Install the cert-manager Helm chart
    helm install \
      --name cert-manager \
      --namespace cert-manager \
      --version v0.8.0 \
      jetstack/cert-manager
    ```

2. ClusterIssuer Resource

    Create a `ClusterIssuer` resource. It is required by `cert-manager` to represent the `Lets Encrypt` certificate
    authority where the signed certificates will be obtained.

    By using the non-namespaced `ClusterIssuer` resource, cert-manager will issue certificates that can be consumed from
    multiple namespaces. `Let’s Encrypt` uses the ACME protocol to verify that you control a given domain name and to issue
    you a certificate. More details on configuring `ClusterIssuer` properties
    [here](https://docs.cert-manager.io/en/latest/tasks/issuers/index.html). `ClusterIssuer` will instruct `cert-manager`
    to issue certificates using the `Lets Encrypt` staging environment used for testing (the root certificate not present
    in browser/client trust stores).

    The default challenge type in the YAML below is `http01`. Other challenges are documented on [letsencrypt.org - Challenge Types](https://letsencrypt.org/docs/challenge-types/)

    > [!IMPORTANT] 
    > Update `<YOUR.EMAIL@ADDRESS>` in the YAML below

    ```bash
    #!/bin/bash
    kubectl apply -f - <<EOF
    apiVersion: certmanager.k8s.io/v1alpha1
    kind: ClusterIssuer
    metadata:
    name: letsencrypt-staging
    spec:
    acme:
        # You must replace this email address with your own.
        # Let's Encrypt will use this to contact you about expiring
        # certificates, and issues related to your account.
        email: <YOUR.EMAIL@ADDRESS>
        # ACME server URL for Let’s Encrypt’s staging environment.
        # The staging environment will not issue trusted certificates but is
        # used to ensure that the verification process is working properly
        # before moving to production
        server: https://acme-staging-v02.api.letsencrypt.org/directory
        privateKeySecretRef:
        # Secret resource used to store the account's private key.
        name: example-issuer-account-key
        # Enable the HTTP-01 challenge provider
        # you prove ownership of a domain by ensuring that a particular
        # file is present at the domain
        http01: {}
    EOF
    ```

3. Deploy App

    Create an Ingress resource to Expose the `guestbook` application using the Application Gateway with the Lets Encrypt Certificate.

    Ensure you Application Gateway has a public Frontend IP configuration with a DNS name (either using the
    default `azure.com` domain, or provision a `Azure DNS Zone` service, and assign your own custom domain).
    Note the annotation `certmanager.k8s.io/cluster-issuer: letsencrypt-staging`, which tells cert-manager to process the
    tagged Ingress resource.

    > [!IMPORTANT] 
    > Update `<PLACEHOLDERS.COM>` in the YAML below with your own domain (or the Application Gateway one, for example
    'kh-aks-ingress.westeurope.cloudapp.azure.com')

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
    name: guestbook-letsencrypt-staging
    annotations:
        kubernetes.io/ingress.class: azure/application-gateway
        certmanager.k8s.io/cluster-issuer: letsencrypt-staging
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
    Your browser may warn you of an invalid cert authority. The staging certificate is issued by `CN=Fake LE Intermediate X1`. This is an indication that the system worked as expected and you are ready for your production certificate.

4. Production Certificate

    Once your staging certificate is setup successfully you can switch to a production ACME server:
    1. Replace the staging annotation on your Ingress resource with: `certmanager.k8s.io/cluster-issuer: letsencrypt-prod`
    1. Delete the existing staging `ClusterIssuer` you created in the previous step and create a new one by replacing the ACME server from the ClusterIssuer YAML above with `https://acme-v02.api.letsencrypt.org/directory`

5. Certificate Expiration and Renewal

    Before the `Lets Encrypt` certificate expires, `cert-manager` will automatically update the certificate in the Kubernetes secret store. At that point, Application Gateway Ingress Controller will apply the updated secret referenced in the ingress resources it is using to configure the Application Gateway.
