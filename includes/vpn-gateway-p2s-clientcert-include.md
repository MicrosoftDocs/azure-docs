Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. The client certificate is generated from the root certificate and installed on each client computer. If a valid client certificate is not installed and the client tries to connect to the VNet, authentication fails.

You can either generate a unique certificate for each client, or you can use the same certificate for multiple clients. The advantage to generating unique client certificates is the ability to revoke a single certificate. Otherwise, if multiple clients are using the same client certificate and you need to revoke it, you have to generate and install new certificates for all the clients that use that certificate to authenticate.

You can generate client certificates using the following methods:

- **Enterprise certificate:**

  - If you are using an enterprise certificate solution, generate a client certificate with the common name value format 'name@yourdomain.com', rather than the 'domain name\username' format.
  - Make sure the client certificate is based on the 'User' certificate template that has 'Client Authentication' as the first item in the use list, rather than Smart Card Logon, etc. You can check the certificate by double-clicking the client certificate and viewing *Details > Enhanced Key Usage*.

- **Self-signed root certificate:** If you generate a client certificate from a self-signed root certificate using the [Create a self-signed root certificate for Point-to-Site connections](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientcert) article instructions, it's automatically installed on the computer that you used to generate it. If you want to install a client certificate on another client computer, you need to export it. Follow the instructions in the article to [export the certificate](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientexport).