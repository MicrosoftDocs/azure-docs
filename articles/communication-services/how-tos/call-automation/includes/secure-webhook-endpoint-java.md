---
title: include file
description: Java webhook callback security
services: azure-communication-services
author: Richard Cho
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/08/2023
ms.topic: include
ms.topic: include file
ms.author: richardcho
---

## Improving Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard Open ID Connect (OIDC) JWT validation techniques to ensure the integrity of the token as follows. The lifetime of the JWT is five (5) minutes and a new token is created for every event sent to the callback URI.

1. Obtain the Open ID configuration URL: <https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration>
2. The following sample uses Spring framework, created using [spring initializr](https://start.spring.io/) with Maven as project build tool.
3. Add the following dependencies in your `pom.xml`:

```
  <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
   <groupId>org.springframework.security</groupId>
   <artifactId>spring-security-oauth2-jose</artifactId>
  </dependency>
  <dependency>
   <groupId>org.springframework.security</groupId>
   <artifactId>spring-security-oauth2-resource-server</artifactId>
  </dependency>
```

4. Configure your application to validate the JWT and the configuration of your Azure Communication Services resource. You need the `audience` values as it is present in the JWT payload.
5. Validate the issuer, audience and the JWT token.
   - The audience is your Azure Communication Services resource ID you used to set up your Call Automation client. Refer [here](../../../quickstarts/voice-video-calling/get-resource-id.md) about how to get it.
   - The JSON Web Key Set (JWKS) endpoint in the OpenId configuration contains the keys used to validate the JWT token. When the signature is valid and the token hasn't expired (within 5 minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to configure OIDC client to validate webhook payload using JWT

```java
package callautomation.example.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;

@EnableWebSecurity
public class TokenValidationConfiguration {
    @Value("ACS resource ID")
    private String audience;

    @Value("https://acscallautomation.communication.azure.com")
    private String issuer;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .mvcMatchers("/api/callbacks").permitAll()
                .anyRequest()
                .and()
                .oauth2ResourceServer()
                .jwt()
                .decoder(jwtDecoder());

        return http.build();
    }

    class AudienceValidator implements OAuth2TokenValidator<Jwt> {
        private String audience;

        OAuth2Error error = new OAuth2Error("invalid_token", "The required audience is missing", null);

        public AudienceValidator(String audience) {
            this.audience = audience;
        }

        @Override
        public OAuth2TokenValidatorResult validate(Jwt token) {
            if (token.getAudience().contains(audience)) {
                return OAuth2TokenValidatorResult.success();
            } else {
                return OAuth2TokenValidatorResult.failure(error);
            }
        }
    }

    JwtDecoder jwtDecoder() {
        OAuth2TokenValidator<Jwt> withAudience = new AudienceValidator(audience);
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuer);
        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(withAudience, withIssuer);

        NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder) JwtDecoders.fromOidcIssuerLocation(issuer);
        jwtDecoder.setJwtValidator(validator);

        return jwtDecoder;
    }
}
```
