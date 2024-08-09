---
title: Bicep warnings and error codes
description: Lists the warnings and error codes.
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-bicep, devx-track-arm-template
ms.date: 08/06/2024
---

# Bicep core diagnostics

If you need more information about a particular diagnostic code, select the **Feedback** button in the upper right corner of the page and specify the code.

| Code       | Level | Description |
|------------|-------|-_-----------|
| BCP001     | Error | The following token is not recognized: "{token}". |
| BCP002     | Error | The multi-line comment at this location is not terminated. Terminate it with the */ character sequence. |
| BCP003     | Error | The string at this location is not terminated. Terminate the string with a single quote character. |
| BCP004     | Error | The string at this location is not terminated due to an unexpected new line character. |
| BCP005     | Error | The string at this location is not terminated. Complete the escape sequence and terminate the string with a single unescaped quote character. |
| BCP006     | Error | The specified escape sequence is not recognized. Only the following escape sequences are allowed: {ToQuotedString(escapeSequences)}. |
| BCP007     | Error | This declaration type is not recognized. Specify a metadata, parameter, variable, resource, or output declaration. |
| BCP008     | Error | Expected the "=" token, or a newline at this location. |
| BCP009     | Error | Expected a literal value, an array, an object, a parenthesized expression, or a function call at this location. |
| BCP010     | Error | Expected a valid 64-bit signed integer. |
| BCP011     | Error | The type of the specified value is incorrect. Specify a string, boolean, or integer literal. |
| BCP012     | Error | Expected the "{keyword}" keyword at this location. |
| BCP013     | Error | Expected a parameter identifier at this location. |
| BCP015     | Error | Expected a variable identifier at this location. |
| BCP016     | Error | Expected an output identifier at this location. |
| BCP017     | Error | Expected a resource identifier at this location. |
| <a id='BCP018' />[BCP018](./diagnostics/bcp018.md) | Error | Expected the \<character> character at this location. |
| BCP019     | Error | Expected a new line character at this location. |
| BCP020     | Error | Expected a function or property name at this location. |
| BCP021     | Error | Expected a numeric literal at this location. |
| BCP022     | Error | Expected a property name at this location. |
| BCP023     | Error | Expected a variable or function name at this location. |
| BCP024     | Error | The identifier exceeds the limit of {LanguageConstants.MaxIdentifierLength}. Reduce the length of the identifier. |
| BCP025     | Error | The property "{property}" is declared multiple times in this object. Remove or rename the duplicate properties. |
| BCP026     | Error | The output expects a value of type "{expectedType}" but the provided value is of type "{actualType}". |
| BCP028     | Error | Identifier "{identifier}" is declared multiple times. Remove or rename the duplicates. |
| BCP029     | Error | The resource type is not valid. Specify a valid resource type of format "\<types>@\<apiVersion>". |
| BCP030     | Error | The output type is not valid. Please specify one of the following types: {ToQuotedString(validTypes)}. |
| BCP031     | Error | The parameter type is not valid. Please specify one of the following types: {ToQuotedString(validTypes)}. |
| BCP032     | Error | The value must be a compile-time constant. |
| <a id='BCP033' />[BCP033](./diagnostics/bcp033.md) | Error/Warning | Expected a value of type \<data-type> but the provided value is of type \<data-type>. |
| BCP034     | Error/Warning | The enclosing array expected an item of type "{expectedType}", but the provided item was of type "{actualType}". |
| <a id='BCP035' />[BCP035](./diagnostics/bcp035.md) | Error/Warning | The specified \<data-type> declaration is missing the following required properties: \<property-name>. |
| <a id='BCP036' />[BCP036](./diagnostics/bcp036.md) | Error/Warning | The property \<property-name> expected a value of type \<data-type> but the provided value is of type \<data-type>. |
| <a id='BCP037' />[BCP037](./diagnostics/bcp037.md) | Error/Warning | The property \<property-name> is not allowed on objects of type \<type-definition>. |
| <a id='BCP040' />[BCP040](./diagnostics/bcp040.md) | Error/Warning | String interpolation is not supported for keys on objects of type \<type-definition>. |
| BCP041     | Error | Values of type "{valueType}" cannot be assigned to a variable. |
| BCP043     | Error | This is not a valid expression. |
| BCP044     | Error | Cannot apply operator "{operatorName}" to operand of type "{type}". |
| BCP045     | Error | Cannot apply operator "{operatorName}" to operands of type "{type1}" and "{type2}".{(additionalInfo is null ? string.Empty : " " + additionalInfo)} |
| BCP046     | Error | Expected a value of type "{type}". |
| BCP047     | Error | String interpolation is unsupported for specifying the resource type. |
| BCP048     | Error | Cannot resolve function overload. For details, see the documentation. |
| BCP049     | Error | The array index must be of type "{LanguageConstants.String}" or "{LanguageConstants.Int}" but the provided index was of type "{wrongType}". |
| BCP050     | Error | The specified path is empty. |
| BCP051     | Error | The specified path begins with "/". Files must be referenced using relative paths. |
| <a id='BCP052' />[BCP052](./diagnostics/bcp052.md)     | Error/Warning | The type \<type-name> does not contain property \<property-name>. |
| <a id='BCP053' />[BCP053](./diagnostics/bcp053.md) | Error/Warning | The type \<type-name> does not contain property \<property-name>. Available properties include \<property-names>. |
| BCP054     | Error | The type "{type}" does not contain any properties. |
| BCP055     | Error | Cannot access properties of type "{wrongType}". An "{LanguageConstants.Object}" type is required. |
| BCP056     | Error | The reference to name "{name}" is ambiguous because it exists in namespaces {ToQuotedString(namespaces)}. The reference must be fully qualified. |
| <a id='BCP057' />[BCP057](./diagnostics/bcp057.md) | Error | The name \<name> does not exist in the current context. |
| BCP059     | Error | The name "{name}" is not a function. |
| BCP060     | Error | The "variables" function is not supported. Directly reference variables by their symbolic names. |
| BCP061     | Error | The "parameters" function is not supported. Directly reference parameters by their symbolic names. |
| <a id='BCP062' />[BCP062](./diagnostics/bcp062.md) | Error | The referenced declaration with name <type-name> is not valid. |
| BCP063     | Error | The name "{name}" is not a parameter, variable, resource or module. |
| BCP064     | Error | Found unexpected tokens in interpolated expression. |
| BCP065     | Error | Function "{functionName}" is not valid at this location. It can only be used as a parameter default value. |
| BCP066     | Error | Function "{functionName}" is not valid at this location. It can only be used in resource declarations. |
| BCP067     | Error | Cannot call functions on type "{wrongType}". An "{LanguageConstants.Object}" type is required. |
| BCP068     | Error | Expected a resource type string. Specify a valid resource type of format "\<types>@\<apiVersion>". |
| BCP069     | Error | The function "{function}" is not supported. Use the "{@operator}" operator instead. |
| BCP070     | Error | Argument of type "{argumentType}" is not assignable to parameter of type "{parameterType}". |
| BCP071     | Error | Expected {expected}, but got {argumentCount}. |
| <a id='BCP072' />[BCP072](./diagnostics/bcp072.md) | Error | This symbol cannot be referenced here. Only other parameters can be referenced in parameter default values. |
| <a id='BCP073' />[BCP073](./diagnostics/bcp073.md) | Error/Warning | The property \<property-name> is read-only. Expressions cannot be assigned to read-only properties. |
| BCP074     | Error | Indexing over arrays requires an index of type "{LanguageConstants.Int}" but the provided index was of type "{wrongType}". |
| BCP075     | Error | Indexing over objects requires an index of type "{LanguageConstants.String}" but the provided index was of type "{wrongType}". |
| BCP076     | Error | Cannot index over expression of type "{wrongType}". Arrays or objects are required. |
| <a id='BCP077' />[BCP077](./diagnostics/bcp077.md) | Error/Warning | The property \<property-name> on type \<type-name> is write-only. Write-only properties cannot be accessed. |
| <a id='BCP078' />[BCP078](./diagnostics/bcp078.md) | Error/Warning | The property \<property-name> requires a value of type \<type-name>, but none was supplied. |
| BCP079     | Error | This expression is referencing its own declaration, which is not allowed. |
| BCP080     | Error | The expression is involved in a cycle ("{string.Join("\" -> \"", cycle)}"). |
| BCP081     | Warning | Resource type "{resourceTypeReference.FormatName()}" does not have types available. Bicep is unable to validate resource properties prior to deployment, but this will not block the resource from being deployed. |
| BCP082     | Error | The name "{name}" does not exist in the current context. Did you mean "{suggestedName}"? |
| <a id='BCP083' />[BCP083](./diagnostics/bcp083.md) | Error/Warning | The type \<type-definition> does not contain property \<property-name>. Did you mean \<property-name>? |
| BCP084     | Error | The symbolic name "{name}" is reserved. Please use a different symbolic name. Reserved namespaces are {ToQuotedString(namespaces.OrderBy(ns => ns))}. |
| BCP085     | Error | The specified file path contains one ore more invalid path characters. The following are not permitted: {ToQuotedString(forbiddenChars.OrderBy(x => x).Select(x => x.ToString()))}. |
| BCP086     | Error | The specified file path ends with an invalid character. The following are not permitted: {ToQuotedString(forbiddenPathTerminatorChars.OrderBy(x => x).Select(x => x.ToString()))}. |
| BCP087     | Error | Array and object literals are not allowed here. |
| <a id='BCP088' />[BCP088](./diagnostics/bcp088.md) | Error/Warning | The property \<property-name> expected a value of type \<type-name> but the provided value is of type \<type-name>. Did you mean \<type-name>? |
| <a id='BCP089' />[BCP089](./diagnostics/bcp089.md) | Error/Warning | The property \<property-name> is not allowed on objects of type \<resource-type>. Did you mean \<property-name>? |
| BCP090     | Error | This module declaration is missing a file path reference. |
| BCP091     | Error | An error occurred reading file. {failureMessage} |
| BCP092     | Error | String interpolation is not supported in file paths. |
| BCP093     | Error | File path "{filePath}" could not be resolved relative to "{parentPath}". |
| BCP094     | Error | This module references itself, which is not allowed. |
| BCP095     | Error | The file is involved in a cycle ("{string.Join("\" -> \"", cycle)}"). |
| BCP096     | Error | Expected a module identifier at this location. |
| BCP097     | Error | Expected a module path string. This should be a relative path to another bicep file, e.g. 'myModule.bicep' or '../parent/myModule.bicep' |
| BCP098     | Error | The specified file path contains a "\" character. Use "/" instead as the directory separator character. |
| BCP099     | Error | The "{LanguageConstants.ParameterAllowedPropertyName}" array must contain one or more items. |
| BCP100     | Error | The function "if" is not supported. Use the "?:\" (ternary conditional) operator instead, e.g. condition ? ValueIfTrue : ValueIfFalse |
| BCP101     | Error | The "createArray" function is not supported. Construct an array literal using []. |
| BCP102     | Error | The "createObject" function is not supported. Construct an object literal using {}. |
| BCP103     | Error | The following token is not recognized: "{token}". Strings are defined using single quotes in bicep. |
| BCP104     | Error | The referenced module has errors. |
| BCP105     | Error | Unable to load file from URI "{fileUri}". |
| BCP106     | Error | Expected a new line character at this location. Commas are not used as separator delimiters. |
| BCP107     | Error | The function "{name}" does not exist in namespace "{namespaceType.Name}". |
| BCP108     | Error | The function "{name}" does not exist in namespace "{namespaceType.Name}". Did you mean "{suggestedName}"? |
| BCP109     | Error | The type "{type}" does not contain function "{name}". |
| BCP110     | Error | The type "{type}" does not contain function "{name}". Did you mean "{suggestedName}"? |
| BCP111     | Error | The specified file path contains invalid control code characters. |
| BCP112     | Error | The "{LanguageConstants.TargetScopeKeyword}" cannot be declared multiple times in one file. |
| BCP113     | Warning | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeTenant}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include tenant: tenant(), named management group: managementGroup(\<name>), named subscription: subscription(\<subId>), or named resource group in a named subscription: resourceGroup(\<subId>, \<name>). |
| BCP114     | Warning | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeManagementGroup}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include current management group: managementGroup(), named management group: managementGroup(\<name>), named subscription: subscription(\<subId>), tenant: tenant(), or named resource group in a named subscription: resourceGroup(\<subId>, \<name>). |
| BCP115     | Warning | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeSubscription}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include current subscription: subscription(), named subscription: subscription(\<subId>), named resource group in same subscription: resourceGroup(\<name>), named resource group in different subscription: resourceGroup(\<subId>, \<name>), or tenant: tenant(). |
| BCP116     | Warning | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeResourceGroup}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include current resource group: resourceGroup(), named resource group in same subscription: resourceGroup(\<name>), named resource group in a different subscription: resourceGroup(\<subId>, \<name>), current subscription: subscription(), named subscription: subscription(\<subId>) or tenant: tenant(). |
| BCP117     | Error | An empty indexer is not allowed. Specify a valid expression. |
| BCP118     | Error | Expected the "{" character, the "[" character, or the "if" keyword at this location. |
| BCP119     | Warning | Unsupported scope for extension resource deployment. Expected a resource reference. |
| BCP120     | Error | This expression is being used in an assignment to the "{propertyName}" property of the "{objectTypeName}" type, which requires a value that can be calculated at the start of the deployment. |
| BCP121     | Error | Resources: {ToQuotedString(resourceNames)} are defined with this same name in a file. Rename them or split into different modules. |
| BCP122     | Error | Modules: {ToQuotedString(moduleNames)} are defined with this same name and this same scope in a file. Rename them or split into different modules. |
| BCP123     | Error | Expected a namespace or decorator name at this location. |
| BCP124     | Error | The decorator "{decoratorName}" can only be attached to targets of type "{attachableType}", but the target has type "{targetType}". |
| BCP125     | Error | Function "{functionName}" cannot be used as a parameter decorator. |
| BCP126     | Error | Function "{functionName}" cannot be used as a variable decorator. |
| BCP127     | Error | Function "{functionName}" cannot be used as a resource decorator. |
| BCP128     | Error | Function "{functionName}" cannot be used as a module decorator. |
| BCP129     | Error | Function "{functionName}" cannot be used as an output decorator. |
| BCP130     | Error | Decorators are not allowed here. |
| BCP132     | Error | Expected a declaration after the decorator. |
| BCP133     | Error | The unicode escape sequence is not valid. Valid unicode escape sequences range from \\u{0} to \\u{10FFFF}. |
| BCP134     | Warning | Scope {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(suppliedScope))} is not valid for this module. Permitted scopes: {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(supportedScopes))}. |
| BCP135     | Warning | Scope {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(suppliedScope))} is not valid for this resource type. Permitted scopes: {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(supportedScopes))}. |
| BCP136     | Error | Expected a loop item variable identifier at this location. |
| BCP137     | Error | Loop expected an expression of type "{LanguageConstants.Array}" but the provided value is of type "{actualType}". |
| BCP138     | Error | For-expressions are not supported in this context. For-expressions may be used as values of resource, module, variable, and output declarations, or values of resource and module properties. |
| BCP139     | Warning | A resource's scope must match the scope of the Bicep file for it to be deployable. You must use modules to deploy resources to a different scope. |
| BCP140     | Error | The multi-line string at this location is not terminated. Terminate it with "'''. |
| BCP141     | Error | The expression cannot be used as a decorator as it is not callable. |
| BCP142     | Error | Property value for-expressions cannot be nested. |
| BCP143     | Error | For-expressions cannot be used with properties whose names are also expressions. |
| BCP144     | Error | Directly referencing a resource or module collection is not currently supported here. Apply an array indexer to the expression. |
| BCP145     | Error | Output "{identifier}" is declared multiple times. Remove or rename the duplicates. |
| BCP147     | Error | Expected a parameter declaration after the decorator. |
| BCP148     | Error | Expected a variable declaration after the decorator. |
| BCP149     | Error | Expected a resource declaration after the decorator. |
| BCP150     | Error | Expected a module declaration after the decorator. |
| BCP151     | Error | Expected an output declaration after the decorator. |
| BCP152     | Error | Function "{functionName}" cannot be used as a decorator. |
| BCP153     | Error | Expected a resource or module declaration after the decorator. |
| BCP154     | Error | Expected a batch size of at least {limit} but the specified value was "{value}". |
| BCP155     | Error | The decorator "{decoratorName}" can only be attached to resource or module collections. |
| BCP156     | Error | The resource type segment "{typeSegment}" is invalid. Nested resources must specify a single type segment, and optionally can specify an API version using the format "\<type>@\<apiVersion>". |
| BCP157     | Error | The resource type cannot be determined due to an error in the containing resource. |
| BCP158     | Error | Cannot access nested resources of type "{wrongType}". A resource type is required. |
| BCP159     | Error | The resource "{resourceName}" does not contain a nested resource named "{identifierName}". Known nested resources are: {ToQuotedString(nestedResourceNames)}. |
| BCP160     | Error | A nested resource cannot appear inside of a resource with a for-expression. |
| BCP162     | Error | Expected a loop item variable identifier or "(" at this location. |
| BCP164     | Error | A child resource's scope is computed based on the scope of its ancestor resource. This means that using the "scope" property on a child resource is unsupported. |
| BCP165     | Error | A resource's computed scope must match that of the Bicep file for it to be deployable. This resource's scope is computed from the "scope" property value assigned to ancestor resource "{ancestorIdentifier}". You must use modules to deploy resources to a different scope. |
| BCP166     | Error | Duplicate "{decoratorName}" decorator. |
| BCP167     | Error | Expected the "{" character or the "if" keyword at this location. |
| BCP168     | Error | Length must not be a negative value. |
| BCP169     | Error | Expected resource name to contain {expectedSlashCount} "/" character(s). The number of name segments must match the number of segments in the resource type. |
| BCP170     | Error | Expected resource name to not contain any "/" characters. Child resources with a parent resource reference (via the parent property or via nesting) must not contain a fully-qualified name. |
| BCP171     | Error | Resource type "{resourceType}" is not a valid child resource of parent "{parentResourceType}". |
| BCP172     | Error | The resource type cannot be validated due to an error in parent resource "{resourceName}". |
| BCP173     | Error | The property "{property}" cannot be used in an existing resource declaration. |
| BCP174     | Warning | Type validation is not available for resource types declared containing a "/providers/" segment. Please instead use the "scope" property. |
| BCP176     | Error | Values of the "any" type are not allowed here. |
| BCP177     | Error | This expression is being used in the if-condition expression, which requires a value that can be calculated at the start of the deployment.{variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP178     | Error | This expression is being used in the for-expression, which requires a value that can be calculated at the start of the deployment.{variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP179     | Warning | Unique resource or deployment name is required when looping. The loop item variable "{itemVariableName}" or the index variable "{indexVariableName}" must be referenced in at least one of the value expressions of the following properties in the loop body: {ToQuotedString(expectedVariantProperties)} |
| BCP180     | Error | Function "{functionName}" is not valid at this location. It can only be used when directly assigning to a module parameter with a secure decorator. |
| BCP181     | Error | This expression is being used in an argument of the function "{functionName}", which requires a value that can be calculated at the start of the deployment.{variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP182     | Error | This expression is being used in the for-body of the variable "{variableName}", which requires values that can be calculated at the start of the deployment.{variableDependencyChainClause}{violatingPropertyNameClause}{accessiblePropertiesClause} |
| BCP183     | Error | The value of the module "params" property must be an object literal. |
| BCP184     | Error | File '{filePath}' exceeded maximum size of {maxSize} {unit}. |
| BCP185     | Warning | Encoding mismatch. File was loaded with '{detectedEncoding}' encoding. |
| BCP186     | Error | Unable to parse literal JSON value. Please ensure that it is well-formed. |
| BCP187     | Warning | The property "{property}" does not exist in the resource or type definition, although it might still be valid.{TypeInaccuracyClause} |
| BCP188     | Error | The referenced ARM template has errors. Please see [https://aka.ms/arm-template](https://aka.ms/arm-template) for information on how to diagnose and fix the template. |
| BCP189     | Error | (allowedSchemes.Contains(ArtifactReferenceSchemes.Local, StringComparer.Ordinal), allowedSchemes.Any(scheme => !string.Equals(scheme, ArtifactReferenceSchemes.Local, StringComparison.Ordinal))) switch { (false, false) => "Module references are not supported in this context.", (false, true) => $"The specified module reference scheme \"{badScheme}\" is not recognized. Specify a module reference using one of the following schemes: {FormatSchemes()}", (true, false) => $"The specified module reference scheme \"{badScheme}\" is not recognized. Specify a path to a local module file.", (true, true) => $"The specified module reference scheme \"{badScheme}\" is not recognized. Specify a path to a local module file or a module reference using one of the following schemes: {FormatSchemes()}"} |
| BCP190     | Error | The artifact with reference "{artifactRef}" has not been restored. |
| BCP191     | Error | Unable to restore the artifact with reference "{artifactRef}". |
| <a id='BCP192' />[BCP192](./diagnostics/bcp192.md) | Error | Unable to restore the artifact with reference \<reference>: \<error-message>. |
| BCP193     | Error | {BuildInvalidOciArtifactReferenceClause(aliasName, badRef)} Specify a reference in the format of "{ArtifactReferenceSchemes.Oci}:\<artifact-uri>:\<tag>", or "{ArtifactReferenceSchemes.Oci}/\<module-alias>:\<module-name-or-path>:\<tag>". |
| BCP194     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, badRef)} Specify a reference in the format of "{ArtifactReferenceSchemes.TemplateSpecs}:\<subscription-ID>/\<resource-group-name>/\<template-spec-name>:\<version>", or "{ArtifactReferenceSchemes.TemplateSpecs}/\<module-alias>:\<template-spec-name>:\<version>". |
| BCP195     | Error | {BuildInvalidOciArtifactReferenceClause(aliasName, badRef)} The artifact path segment "{badSegment}" is not valid. Each artifact name path segment must be a lowercase alphanumeric string optionally separated by a ".", "_", or \"-\"." |
| BCP196     | Error | The module tag or digest is missing. |
| BCP197     | Error | The tag "{badTag}" exceeds the maximum length of {maxLength} characters. |
| BCP198     | Error | The tag "{badTag}" is not valid. Valid characters are alphanumeric, ".", "_", or "-" but the tag cannot begin with ".", "_", or "-". |
| BCP199     | Error | Module path "{badRepository}" exceeds the maximum length of {maxLength} characters. |
| BCP200     | Error | The registry "{badRegistry}" exceeds the maximum length of {maxLength} characters. |
| BCP201     | Error | Expected a provider specification string of with a valid format at this location. Valid formats are "br:\<providerRegistryHost>/\<providerRepositoryPath>@\<providerVersion>" or "br/\<providerAlias>:\<providerName>@\<providerVersion>". |
| BCP202     | Error | Expected a provider alias name at this location. |
| BCP203     | Error | Using provider statements requires enabling EXPERIMENTAL feature "Extensibility". |
| BCP204     | Error | Provider namespace "{identifier}" is not recognized. |
| BCP205     | Error | Provider namespace "{identifier}" does not support configuration. |
| BCP206     | Error | Provider namespace "{identifier}" requires configuration, but none was provided. |
| BCP207     | Error | Namespace "{identifier}" is declared multiple times. Remove the duplicates. |
| BCP208     | Error | The specified namespace "{badNamespace}" is not recognized. Specify a resource reference using one of the following namespaces: {ToQuotedString(allowedNamespaces)}. |
| BCP209     | Error | Failed to find resource type "{resourceType}" in namespace "{@namespace}". |
| BCP210     | Error | Resource type belonging to namespace "{childNamespace}" cannot have a parent resource type belonging to different namespace "{parentNamespace}". |
| BCP211     | Error | The module alias name "{aliasName}" is invalid. Valid characters are alphanumeric, "_", or "-". |
| BCP212     | Error | The Template Spec module alias name "{aliasName}" does not exist in the {BuildBicepConfigurationClause(configFileUri)}. |
| BCP213     | Error | The OCI artifact module alias name "{aliasName}" does not exist in the {BuildBicepConfigurationClause(configFileUri)}. |
| BCP214     | Error | The Template Spec module alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is in valid. The "subscription" property cannot be null or undefined. |
| BCP215     | Error | The Template Spec module alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is in valid. The "resourceGroup" property cannot be null or undefined. |
| BCP216     | Error | The OCI artifact module alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is invalid. The "registry" property cannot be null or undefined. |
| BCP217     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The subscription ID "{subscriptionId}" is not a GUID. |
| BCP218     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The resource group name "{resourceGroupName}" exceeds the maximum length of {maximumLength} characters. |
| BCP219     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The resource group name "{resourceGroupName}" is invalid. Valid characters are alphanumeric, unicode characters, ".", "_", "-", "(", or ")", but the resource group name cannot end with ".". |
| BCP220     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec name "{templateSpecName}" exceeds the maximum length of {maximumLength} characters. |
| BCP221     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec name "{templateSpecName}" is invalid. Valid characters are alphanumeric, ".", "_", "-", "(", or ")", but the Template Spec name cannot end with ".". |
| BCP222     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec version "{templateSpecVersion}" exceeds the maximum length of {maximumLength} characters. |
| BCP223     | Error | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec version "{templateSpecVersion}" is invalid. Valid characters are alphanumeric, ".", "_", "-", "(", or ")", but the Template Spec name cannot end with ".". |
| BCP224     | Error | {BuildInvalidOciArtifactReferenceClause(aliasName, badRef)} The digest "{badDigest}" is not valid. The valid format is a string "sha256:" followed by exactly 64 lowercase hexadecimal digits. |
| BCP225     | Warning | The discriminator property "{propertyName}" value cannot be determined at compilation time. Type checking for this object is disabled. |
| BCP226     | Error | Expected at least one diagnostic code at this location. Valid format is "#disable-next-line diagnosticCode1 diagnosticCode2 ...". |
| BCP227     | Error | The type "{resourceType}" cannot be used as a parameter or output type. Extensibility types are currently not supported as parameters or outputs. |
| BCP229     | Error | The parameter "{parameterName}" cannot be used as a resource scope or parent. Resources passed as parameters cannot be used as a scope or parent of a resource. |
| BCP230 | Warning | The referenced module uses resource type "{resourceTypeReference.FormatName()}" which does not have types available. Bicep is unable to validate resource properties prior to deployment, but this will not block the resource from being deployed. |
| BCP231 | Error | Using resource-typed parameters and outputs requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.ResourceTypedParamsAndOutputs)}". |
| BCP232 | Error | Unable to delete the module with reference "{moduleRef}" from cache.                                                                     |
| BCP233 | Error | Unable to delete the module with reference "{moduleRef}" from cache: {message}                                                           |
| BCP234 | Warning | The ARM function "{armFunctionName}" failed when invoked on the value [{literalValue}]: {message}                                         |
| BCP235 | Error | Specified JSONPath does not exist in the given file or is invalid.                                                                       |
| BCP236 | Error | Expected a new line or comma character at this location.                                                                                 |
| BCP237 | Error | Expected a comma character at this location.                                                                                             |
| BCP238 | Error | Unexpected new line character after a comma.                                                                                             |
| BCP239 | Error | Identifier "{name}" is a reserved Bicep symbol name and cannot be used in this context.                                                  |
| BCP240 | Error | The "parent" property only permits direct references to resources. Expressions are not supported.                                        |
| BCP241 | Warning | The "{functionName}" function is deprecated and will be removed in a future release of Bicep. Please add a comment to https://github.com/Azure/bicep/issues/2017 if you believe this will impact your workflow. |
| BCP242 | Error | Lambda functions may only be specified directly as function arguments.                                                                   |
| BCP243 | Error | Parentheses must contain exactly one expression.                                                                                         |
| BCP244 | Error | {minArgCount == maxArgCount ? $"Expected lambda expression of type "{lambdaType}" with {minArgCount} arguments but received {actualArgCount} arguments." : $"Expected lambda expression of type "{lambdaType}" with between {minArgCount} and {maxArgCount} arguments but received {actualArgCount} arguments."} |
| BCP245 | Warning | Resource type "{resourceTypeReference.FormatName()}" can only be used with the 'existing' keyword.                                        |
| BCP246 | Warning | Resource type "{resourceTypeReference.FormatName()}" can only be used with the 'existing' keyword at the requested scope. Permitted scopes for deployment: {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(writableScopes))}. |
| BCP247 | Error | Using lambda variables inside resource or module array access is not currently supported. Found the following lambda variable(s) being accessed: {ToQuotedString(variableNames)}. |
| BCP248 | Error | Using lambda variables inside the "{functionName}" function is not currently supported. Found the following lambda variable(s) being accessed: {ToQuotedString(variableNames)}. |
| BCP249 | Error | Expected loop variable block to consist of exactly 2 elements (item variable and index variable), but found {actualCount}.               |
| BCP250 | Error | Parameter "{identifier}" is assigned multiple times. Remove or rename the duplicates.                                                    |
| BCP256 | Error | The using declaration is missing a bicep template file path reference.                                                                   |
| BCP257 | Error | Expected a Bicep file path string. This should be a relative path to another bicep file, e.g. 'myModule.bicep' or '../parent/myModule.bicep' |
| BCP258 | Warning | The following parameters are declared in the Bicep file but are missing an assignment in the params file: {ToQuotedString(identifiers)}.  |
| BCP259 | Error | The parameter "{identifier}" is assigned in the params file without being declared in the Bicep file.                                     |
| BCP260 | Error | The parameter "{identifier}" expects a value of type "{expectedType}" but the provided value is of type "{actualType}".                   |
| BCP261 | Error | A using declaration must be present in this parameters file.                                                                             |
| BCP262 | Error | More than one using declaration are present                                                                                              |
| BCP263 | Error | The file specified in the using declaration path does not exist                                                                          |
| BCP264 | Error | Resource type "{resourceTypeName}" is declared in multiple imported namespaces ({ToQuotedStringWithCaseInsensitiveOrdering(namespaces)}), and must be fully-qualified. |
| BCP265 | Error | The name "{name}" is not a function. Did you mean "{knownFunctionNamespace}.{knownFunctionName}"?                                         |
| BCP266 | Error | Expected a metadata identifier at this location.                                                                                         |
| BCP267 | Error | Expected a metadata declaration after the decorator.                                                                                      |
| BCP268 | Error | Invalid identifier: "{name}". Metadata identifiers starting with '_' are reserved. Please use a different identifier.                     |
| BCP269 | Error | Function "{functionName}" cannot be used as a metadata decorator.                                                                         |
| BCP271 | Error | Failed to parse the contents of the Bicep configuration file "{configurationPath}" as valid JSON: {parsingErrorMessage.TrimEnd('.')}.     |
| BCP272 | Error | Could not load the Bicep configuration file "{configurationPath}": {loadErrorMessage.TrimEnd('.')}.                                       |
| BCP273 | Error | Failed to parse the contents of the Bicep configuration file "{configurationPath}": {parsingErrorMessage.TrimEnd('.')}.                    |
| BCP274 | Warning | Error scanning "{directoryPath}" for bicep configuration: {scanErrorMessage.TrimEnd('.')}.                                                |
| BCP275 | Error | Unable to open file at path "{directoryPath}". Found a directory instead.                                                                 |
| BCP276 | Error | A using declaration can only reference a Bicep file.                                                                                      |
| BCP277 | Error | A module declaration can only reference a Bicep File, an ARM template, a registry reference or a template spec reference.                 |
| BCP278 | Error | This parameters file references itself, which is not allowed.                                                                             |
| BCP279 | Error | Expected a type at this location. Please specify a valid type expression or one of the following types: {ToQuotedString(LanguageConstants.DeclarationTypes.Keys)}. |
| BCP285 | Error | The type expression could not be reduced to a literal value.                                                                              |
| BCP286 | Error | This union member is invalid because it cannot be assigned to the '{keystoneType}' type.                                                  |
| BCP287 | Error | '{symbolName}' refers to a value but is being used as a type here.                                                                        |
| <a id='BCP288' />[BCP288](./diagnostics/bcp288.md) | Error | \<name> refers to a type but is being used as a value here.                                   |
| BCP289 | Error | The type definition is not valid.                                                                                                         |
| BCP290 | Error | Expected a parameter or type declaration after the decorator.                                                                             |
| BCP291 | Error | Expected a parameter or output declaration after the decorator.                                                                           |
| BCP292 | Error | Expected a parameter, output, or type declaration after the decorator.                                                                    |
| BCP293 | Error | All members of a union type declaration must be literal values.                                                                           |
| <a id='BCP294' />[BCP294](./diagnostics/bcp294.md) | Error | Type unions must be reducible to a single ARM type (such as 'string', 'int', or 'bool').      |
| BCP295 | Error | The '{decoratorName}' decorator may not be used on targets of a union or literal type. The allowed values for this parameter or type definition will be derived from the union or literal type automatically. |
| BCP296 | Error | Property names on types must be compile-time constant values.                                                                             |
| BCP297 | Error | Function "{functionName}" cannot be used as a type decorator.                                                                             |
| BCP298 | Error | This type definition includes itself as required component, which creates a constraint that cannot be fulfilled.                          |
| BCP299 | Error | This type definition includes itself as a required component via a cycle ("{string.Join("\" -> \"", cycle)}").                            |
| BCP300     | Error | Expected a type literal at this location. Please specify a concrete value or a reference to a literal type. |
| BCP301     | Error | The type name "{reservedName}" is reserved and may not be attached to a user-defined type. |
| <a id='BCP302' />[BCP302](./diagnostics/bcp302.md) | Error | The name \<type-name> is not a valid type. Please specify one of the following types: \<type-names>. |
| BCP303     | Error | String interpolation is unsupported for specifying the provider. |
| BCP304     | Error | Invalid provider specifier string. Specify a valid provider of format "\<providerName>@\<providerVersion>". |
| BCP305     | Error | Expected the "with" keyword, "as" keyword, or a new line character at this location. |
| BCP306     | Error | The name "{name}" refers to a namespace, not to a type. |
| BCP307     | Error | The expression cannot be evaluated, because the identifier properties of the referenced existing resource including {ToQuotedString(runtimePropertyNames.OrderBy(x => x))} cannot be calculated at the start of the deployment. In this situation, {accessiblePropertyNamesClause}{accessibleFunctionNamesClause}. |
| BCP308     | Error | The decorator "{decoratorName}" may not be used on statements whose declared type is a reference to a user-defined type. |
| BCP309     | Error | Values of type "{flattenInputType.Name}" cannot be flattened because "{incompatibleType.Name}" is not an array type. |
| BCP311     | Error | The provided index value of "{indexSought}" is not valid for type "{typeName}". Indexes for this type must be between 0 and {tupleLength - 1}. |
| BCP315     | Error | An object type may have at most one additional properties declaration. |
| BCP316     | Error | The "{LanguageConstants.ParameterSealedPropertyName}" decorator may not be used on object types with an explicit additional properties type declaration. |
| BCP317     | Error | Expected an identifier, a string, or an asterisk at this location. |
| BCP318     | Warning | The value of type "{possiblyNullType}" may be null at the start of the deployment, which would cause this access expression (and the overall deployment with it) to fail. If you do not know whether the value will be null and the template would handle a null value for the overall expression, use a `.?` (safe dereference) operator to short-circuit the access expression if the base expression's value is null: {accessExpression.AsSafeAccess().ToString()}. If you know the value will not be null, use a non-null assertion operator to inform the compiler that the value will not be null: {SyntaxFactory.AsNonNullable(expression).ToString()}. |
| BCP319     | Error | The type at "{errorSource}" could not be resolved by the ARM JSON template engine. Original error message: "{message}" |
| BCP320     | Error | The properties of module output resources cannot be accessed directly. To use the properties of this resource, pass it as a resource-typed parameter to another module and access the parameter's properties therein. |
| BCP321     | Warning | Expected a value of type "{expectedType}" but the provided value is of type "{actualType}". If you know the value will not be null, use a non-null assertion operator to inform the compiler that the value will not be null: {SyntaxFactory.AsNonNullable(expression).ToString()}. |
| BCP322     | Error | The `.?` (safe dereference) operator may not be used on instance function invocations. |
| BCP323     | Error | The `[?]` (safe dereference) operator may not be used on resource or module collections. |
| BCP325     | Error | Expected a type identifier at this location. |
| BCP326     | Error | Nullable-typed parameters may not be assigned default values. They have an implicit default of 'null' that cannot be overridden. |
| <a id='BCP327' />[BCP327](./diagnostics/bcp327.md) | Error/Warning | The provided value (which will always be greater than or equal to \<value>) is too large to assign to a target for which the maximum allowable value is \<max-value>. |
| <a id='BCP328' />[BCP328](./diagnostics/bcp328.md) | Error/Warning | The provided value (which will always be less than or equal to \<value>) is too small to assign to a target for which the minimum allowable value is \<max-value>. |
| BCP329     | Warning | The provided value can be as small as {sourceMin} and may be too small to assign to a target with a configured minimum of {targetMin}. |
| BCP330     | Warning | The provided value can be as large as {sourceMax} and may be too large to assign to a target with a configured maximum of {targetMax}. |
| BCP331     | Error | A type's "{minDecoratorName}" must be less than or equal to its "{maxDecoratorName}", but a minimum of {minValue} and a maximum of {maxValue} were specified. |
| <a id='BCP332' />[BCP332](./diagnostics/bcp332.md) | Error/Warning | The provided value (whose length will always be greater than or equal to \<string-length>) is too long to assign to a target for which the maximum allowable length is \<max-length>. |
| <a id='BCP333' />[BCP333](./diagnostics/bcp333.md) | Error/Warning | The provided value (whose length will always be less than or equal to \<string-length>) is too short to assign to a target for which the minimum allowable length is \<min-length>. |
| BCP334     | Warning | The provided value can have a length as small as {sourceMinLength} and may be too short to assign to a target with a configured minimum length of {targetMinLength}. |
| BCP335     | Warning | The provided value can have a length as large as {sourceMaxLength} and may be too long to assign to a target with a configured maximum length of {targetMaxLength}. |
| BCP337     | Error | This declaration type is not valid for a Bicep Parameters file. Specify a "{LanguageConstants.UsingKeyword}", "{LanguageConstants.ParameterKeyword}" or "{LanguageConstants.VariableKeyword}" declaration. |
| BCP338     | Error | Failed to evaluate parameter "{parameterName}": {message} |
| BCP339     | Error | The provided array index value of "{indexSought}" is not valid. Array index should be greater than or equal to 0. |
| BCP340     | Error | Unable to parse literal YAML value. Please ensure that it is well-formed. |
| BCP341     | Error | This expression is being used inside a function declaration, which requires a value that can be calculated at the start of the deployment. {variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP342     | Error | User-defined types are not supported in user-defined function parameters or outputs. |
| BCP344     | Error | Expected an assert identifier at this location. |
| BCP345     | Error | A test declaration can only reference a Bicep File |
| BCP0346    | Error | Expected a test identifier at this location. |
| BCP0347    | Error | Expected a test path string at this location. |
| BCP348     | Error | Using a test declaration statement requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.TestFramework)}". |
| BCP349     | Error | Using an assert declaration requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.Assertions)}". |
| BCP350       | Error | Value of type "{valueType}" cannot be assigned to an assert. Asserts can take values of type 'bool' only. |
| BCP351       | Error | Function "{functionName}" is not valid at this location. It can only be used when directly assigning to a parameter. |
| BCP352       | Error | Failed to evaluate variable "{name}": {message} |
| BCP353       | Error | The {itemTypePluralName} {ToQuotedString(itemNames)} differ only in casing. The ARM deployments engine is not case sensitive and will not be able to distinguish between them. |
| BCP354       | Error | Expected left brace ('{') or asterisk ('*') character at this location. |
| BCP355       | Error | Expected the name of an exported symbol at this location. |
| BCP356       | Error | Expected a valid namespace identifier at this location. |
| BCP358       | Error | This declaration is missing a template file path reference. |
| BCP360       | Error | The '{symbolName}' symbol was not found in (or was not exported by) the imported template. |
| BCP361       | Error | The "@export()" decorator must target a top-level statement. |
| BCP362       | Error | This symbol is imported multiple times under the names {string.Join(", ", importedAs.Select(identifier => $"'{identifier}'"))}. |
| BCP363       | Error | The "{LanguageConstants.TypeDiscriminatorDecoratorName}" decorator can only be applied to object-only union types with unique member types. |
| BCP364       | Error | The property "{discriminatorPropertyName}" must be a required string literal on all union member types. |
| BCP365       | Error | The value "{discriminatorPropertyValue}" for discriminator property "{discriminatorPropertyName}" is duplicated across multiple union member types. The value must be unique across all union member types. |
| BCP366       | Error | The discriminator property name must be "{acceptablePropertyName}" on all union member types. |
| BCP367       | Error | The "{featureName}" feature is temporarily disabled. |
| BCP368       | Error | The value of the "{targetName}" parameter cannot be known until the template deployment has started because it uses a reference to a secret value in Azure Key Vault. Expressions that refer to the "{targetName}" parameter may be used in {LanguageConstants.LanguageFileExtension} files but not in {LanguageConstants.ParamsFileExtension} files. |
| BCP369       | Error | The value of the "{targetName}" parameter cannot be known until the template deployment has started because it uses the default value defined in the template. Expressions that refer to the "{targetName}" parameter may be used in {LanguageConstants.LanguageFileExtension} files but not in {LanguageConstants.ParamsFileExtension} files. |
| BCP372       | Error | The "@export()" decorator may not be applied to variables that refer to parameters, modules, or resource, either directly or indirectly. The target of this decorator contains direct or transitive references to the following unexportable symbols: {ToQuotedString(nonExportableSymbols)}. |
| BCP373       | Error | Unable to import the symbol named "{name}": {message} |
| BCP374       | Error | The imported model cannot be loaded with a wildcard because it contains the following duplicated exports: {ToQuotedString(ambiguousExportNames)}. |
| BCP375       | Error | An import list item that identifies its target with a quoted string must include an 'as \<alias>' clause. |
| BCP376       | Error | The "{name}" symbol cannot be imported because imports of kind {exportMetadataKind} are not supported in files of kind {sourceFileKind}. |
| BCP377       | Error | The provider alias name "{aliasName}" is invalid. Valid characters are alphanumeric, "_", or "-". |
| BCP378       | Error | The OCI artifact provider alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is invalid. The "registry" property cannot be null or undefined. |
| BCP379       | Error | The OCI artifact provider alias name "{aliasName}" does not exist in the {BuildBicepConfigurationClause(configFileUri)}. |
| BCP380       | Error | Artifacts of type: "{artifactType}" are not supported. |
| BCP381       | Warning | Declaring provider namespaces with the "import" keyword has been deprecated. Please use the "provider" keyword instead. |
| BCP383       | Error | The "{typeName}" type is not parameterizable. |
| BCP384       | Error | The "{typeName}" type requires {requiredArgumentCount} argument(s). |
| BCP385       | Error | Using resource-derived types requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.ResourceDerivedTypes)}". |
| BCP386       | Error | The decorator "{decoratorName}" may not be used on statements whose declared type is a reference to a resource-derived type. |
| BCP387       | Error | Indexing into a type requires an integer greater than or equal to 0. |
| BCP388       | Error | Cannot access elements of type "{wrongType}" by index. A tuple type is required. |
| BCP389       | Error | The type "{wrongType}" does not declare an additional properties type. |
| BCP390       | Error | The array item type access operator ('[*]') can only be used with typed arrays. |
| BCP391       | Error | Type member access is only supported on a reference to a named type. |
| BCP392       | Warning | "The supplied resource type identifier "{resourceTypeIdentifier}" was not recognized as a valid resource type name." |
| BCP393       | Warning | "The type pointer segment "{unrecognizedSegment}" was not recognized. Supported pointer segments are: "properties", "items", "prefixItems", and "additionalProperties"." |
| BCP394       | Error | Resource-derived type expressions must derefence a property within the resource body. Using the entire resource body type is not permitted. |
| BCP395       | Error | Declaring provider namespaces using the '\<providerName>@\<version>' expression has been deprecated. Please use an identifier instead. |
| BCP396       | Error | The referenced provider types artifact has been published with malformed content. |
| BCP397       | Error | "Provider {name} is incorrectly configured in the {BuildBicepConfigurationClause(configFileUri)}. It is referenced in the "{RootConfiguration.ImplicitProvidersConfigurationKey}" section, but is missing corresponding configuration in the "{RootConfiguration.ProvidersConfigurationKey}" section." |
| BCP398       | Error | "Provider {name} is incorrectly configured in the {BuildBicepConfigurationClause(configFileUri)}. It is configured as built-in in the "{RootConfiguration.ProvidersConfigurationKey}" section, but no built-in provider exists." |
| BCP399       | Error | Fetching az types from the registry requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.DynamicTypeLoading)}". |
| BCP400       | Error | Fetching types from the registry requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.ProviderRegistry)}". |
| <a id='BCP401' />[BCP401](./diagnostics/bcp401.md) | Error | The spread operator "..." is not permitted in this location. |
| BCP402       | Error | The spread operator \"{spread.Ellipsis.Text}\" can only be used in this context for an expression assignable to type \"{requiredType}\". |
| BCP403       | Error/Warning | The enclosing array expects elements of type \"{expectedType}\", but the array being spread contains elements of incompatible type \"{actualType}\". |
| BCP404       | Error | The \"{LanguageConstants.ExtendsKeyword}\" declaration is missing a bicepparam file path reference"). |
| BCP405       | Error | More than one \"{LanguageConstants.ExtendsKeyword}\" declaration are present") |
| BCP406       | Error | The \"{LanguageConstants.ExtendsKeyword}\" keyword is not supported" |

## Next steps

To learn about Bicep, see [Bicep overview](./overview.md).
