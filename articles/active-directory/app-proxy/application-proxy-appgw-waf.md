# Using Application Gateway WAF to protect your application

When using Azure Active Directory Application Proxy to expose applications deployed on-premises or on sealed Azure Virtual Networks or in other public clouds, you can integrate a WAF in the data flow in order to protect your application from malicious attacks.

## What is Azure WAF?

## Deployment steps

1. Expose your application with AAD App Proxy, ideally with the connectors in an Azure VNet (not strictly required, but it will improve latency)
1. Create an Azure Application Gateway with WAF enabled in prevention mode
1. Configure Azure Application Gateway to send traffic to your internal application
  1.1. Create frontend
  1.1. Create backend
  1.1. Create rule
1. Configure your AAD application to use an FQDN that the connector will resolve to the private IP address of Application Gateway

## Verification

You can send an attack like for example `https://api-appgw.fabrikam.one/api/sqlquery?query=x%22%20or%201%3D1%20--`. `x%22%20or%201%3D1%20--` is the HTTP-encoded representation for `x" or 1=1 --`, a basic SQL injection signature, and Azure WAF will drop that request.

## Next steps

Configure custom WAF rules?
