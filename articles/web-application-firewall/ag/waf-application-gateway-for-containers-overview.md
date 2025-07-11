---
title: Web Application Firewall on Application Gateway for Containers
description: Protect your containerized applications with a Web Application Firewall (WAF) on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: overview
ms.date: 07/22/2025

#CustomerIntent: As a developer, I want to secure my containerized applications so that I can protect them from web vulnerabilities.
---

# Web Application Firewall on Application Gateway for Containers

Web Application Firewall (WAF) on [Azure Application Gateway for Containers](../../application-gateway/for-containers/overview.md) actively protects your Kubernetes workloads against common exploits and vulnerabilities like SQL injections, cross-site scripting attacks and more.

Application Gateway for Containers is an application layer (layer 7) [load balancing](/azure/architecture/guide/technology-choices/load-balancing-overview) and dynamic traffic management product for workloads running in a Kubernetes cluster, and is the evolution of the [Application Gateway Ingress Controller (AGIC)](../../application-gateway/ingress-controller-overview.md). Azure WAF provides real time protection for these application layer workloads through a set of proprietary managed rulesets and a framework for the creation of user generated custom rules. All of these WAF protections exist as part of a WAF policy that is attached to your Application Gateway for Containers deployment via a Security Policy resource and can be applied at the listener or route path levels.

## Configuration

To leverage WAF on your Application Gateway for Containers deployment, you will need to attach your WAF policy via a Security Policy. Security Policy in this context is a new child resource in Azure Resource Manager (ARM) that was introduced as part of the Application Gateway for Containers integration. The Security Policy is referenced by your Application Load Balancer (ALB) controller and helps define the scope of how your WAF policy is applied to your application’s traffic.
Application Gateway for Containers also introduces a new resource called ‘WebApplicationFirewallPolicy’. This custom resource defines at which points the WAF policy is applied and can be configured at the listener or route path level. This configuration is done via your Kubernetes resource’s YAML file. 
Here is an example YAML configuration that shows targeting a specific path called ‘pathA’ on an HTTP Route resource:


```yaml
apiVersion: alb.networking.azure.io/v1
kind: WebApplicationFirewallPolicy
metadata:
  name: sample-waf-policy
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: contoso-waf-route
    namespace: test-infra
    sectionNames: ["pathA"]
  webApplicationFirewall:
    id: /subscriptions/.../Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/waf-policy-0
```

## Limitations

The following functionality is not supported on a WAF Policy associated with an Application Gateway for Containers instance:
- Cross Region & Cross Subscription Not Supported – Your WAF policy needs to be in the same subscription and region as your Application Gateway for Containers resource.
- Core Rule Set (CRS) Managed Rules – Application Gateway for Containers WAF only supports Default Rule Set (DRS) managed rulesets. 
- Legacy Bot Manager Ruleset – Bot Manager Ruleset 0.1 is not supported, but all newer Bot Manager ruleset versions are supported.
- Java Script Challenge Actions on Bot Manager Rules – During preview you cannot set the Action on a Bot Manager rule to Java Script Challenge.
- CoPilot for Security – During preview CoPilot for Security is not supported.

## Pricing

WAF usage is billed in addition to costs associated with Application Gateway for Containers usage. When enabled on your Application Gateway for Containers resource, two additional WAF specific meters are introduced:
- Application Gateway for Containers WAF Hour – this fixed cost is incurred for the duration a Security Policy has a WAF policy referenced.
- Application Gateway for Containers 1 million WAF Requests – this consumption-based meter bills per 1 million requests processed by the WAF and charges for each ruleset that you have enabled. In this context, if you have the Default Ruleset (DRS) and the Bot Manager Ruleset enabled this counts as two rulesets enabled.

For more pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway) and [Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall).

## Related Content

- [Azure Web Application Firewall](../../web-application-firewall/overview.md)
- [Azure Web Application Firewall on Azure Application Gateway](ag-overview.md)
- [Deploy Application Gateway for Containers ALB Controller](../../application-gateway/for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md)

