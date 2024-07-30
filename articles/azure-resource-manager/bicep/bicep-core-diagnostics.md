---
title: Bicep warnings and error codes
description: Lists the warnings and error codes.
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-bicep, devx-track-arm-template
ms.date: 07/24/2024
---

# Bicep core diagnostics

If you need more information about a particular diagnostic code, select the **Feedback** button in the upper right corner of the page and specify the code.

| Code | Description |
|------------|-------------------|
| BCP001     | The following token is not recognized: "{token}". |
| BCP002     | The multi-line comment at this location is not terminated. Terminate it with the */ character sequence. |
| BCP003     | The string at this location is not terminated. Terminate the string with a single quote character. |
| BCP004     | The string at this location is not terminated due to an unexpected new line character. |
| BCP005     | The string at this location is not terminated. Complete the escape sequence and terminate the string with a single unescaped quote character. |
| BCP006     | The specified escape sequence is not recognized. Only the following escape sequences are allowed: {ToQuotedString(escapeSequences)}. |
| BCP007     | This declaration type is not recognized. Specify a metadata, parameter, variable, resource, or output declaration. |
| BCP008     | Expected the "=" token, or a newline at this location. |
| BCP009     | Expected a literal value, an array, an object, a parenthesized expression, or a function call at this location. |
| BCP010     | Expected a valid 64-bit signed integer. |
| BCP011     | The type of the specified value is incorrect. Specify a string, boolean, or integer literal. |
| BCP012     | Expected the "{keyword}" keyword at this location. |
| BCP013     | Expected a parameter identifier at this location. |
| BCP015     | Expected a variable identifier at this location. |
| BCP016     | Expected an output identifier at this location. |
| BCP017     | Expected a resource identifier at this location. |
| BCP018     | Expected the "{character}" character at this location. |
| BCP019     | Expected a new line character at this location. |
| BCP020     | Expected a function or property name at this location. |
| BCP021     | Expected a numeric literal at this location. |
| BCP022     | Expected a property name at this location. |
| BCP023     | Expected a variable or function name at this location. |
| BCP024     | The identifier exceeds the limit of {LanguageConstants.MaxIdentifierLength}. Reduce the length of the identifier. |
| BCP025     | The property "{property}" is declared multiple times in this object. Remove or rename the duplicate properties. |
| BCP026     | The output expects a value of type "{expectedType}" but the provided value is of type "{actualType}". |
| BCP028     | Identifier "{identifier}" is declared multiple times. Remove or rename the duplicates. |
| BCP029     | The resource type is not valid. Specify a valid resource type of format "&lt;types>@&lt;apiVersion>". |
| BCP030     | The output type is not valid. Please specify one of the following types: {ToQuotedString(validTypes)}. |
| BCP031     | The parameter type is not valid. Please specify one of the following types: {ToQuotedString(validTypes)}. |
| BCP032     | The value must be a compile-time constant. |
| <a id='BCP033' />[BCP033](./diagnostics/bcp033.md) | Expected a value of type &lt;data-type> but the provided value is of type &lt;data-type>. |
| BCP034     | The enclosing array expected an item of type "{expectedType}", but the provided item was of type "{actualType}". |
| <a id='BCP035' />[BCP035](./diagnostics/bcp035.md) | The specified &lt;data-type> declaration is missing the following required properties: &lt;property-name>. |
| <a id='BCP036' />[BCP036](./diagnostics/bcp036.md) | The property &lt;property-name> expected a value of type &lt;data-type> but the provided value is of type &lt;data-type>. |
| <a id='BCP037' />[BCP037](./diagnostics/bcp037.md) | The property &lt;property-name> is not allowed on objects of type &lt;type-definition>. |
| <a id='BCP040' />[BCP040](./diagnostics/bcp040.md) | String interpolation is not supported for keys on objects of type &lt;type-definition>. |
| BCP041     | Values of type "{valueType}" cannot be assigned to a variable. |
| BCP043     | This is not a valid expression. |
| BCP044     | Cannot apply operator "{operatorName}" to operand of type "{type}". |
| BCP045     | Cannot apply operator "{operatorName}" to operands of type "{type1}" and "{type2}".{(additionalInfo is null ? string.Empty : " " + additionalInfo)} |
| BCP046     | Expected a value of type "{type}". |
| BCP047     | String interpolation is unsupported for specifying the resource type. |
| BCP048     | Cannot resolve function overload. For details, see the documentation. |
| BCP049     | The array index must be of type "{LanguageConstants.String}" or "{LanguageConstants.Int}" but the provided index was of type "{wrongType}". |
| BCP050     | The specified path is empty. |
| BCP051     | The specified path begins with "/". Files must be referenced using relative paths. |
| BCP052     | The type "{type}" does not contain property "{badProperty}". |
| BCP053     | The type "{type}" does not contain property "{badProperty}". Available properties include {ToQuotedString(availableProperties)}. |
| BCP054     | The type "{type}" does not contain any properties. |
| BCP055     | Cannot access properties of type "{wrongType}". An "{LanguageConstants.Object}" type is required. |
| BCP056     | The reference to name "{name}" is ambiguous because it exists in namespaces {ToQuotedString(namespaces)}. The reference must be fully qualified. |
| BCP057     | The name "{name}" does not exist in the current context. |
| BCP059     | The name "{name}" is not a function. |
| BCP060     | The "variables" function is not supported. Directly reference variables by their symbolic names. |
| BCP061     | The "parameters" function is not supported. Directly reference parameters by their symbolic names. |
| BCP062     | The referenced declaration with name "{name}" is not valid. |
| BCP063     | The name "{name}" is not a parameter, variable, resource or module. |
| BCP064     | Found unexpected tokens in interpolated expression. |
| BCP065     | Function "{functionName}" is not valid at this location. It can only be used as a parameter default value. |
| BCP066     | Function "{functionName}" is not valid at this location. It can only be used in resource declarations. |
| BCP067     | Cannot call functions on type "{wrongType}". An "{LanguageConstants.Object}" type is required. |
| BCP068     | Expected a resource type string. Specify a valid resource type of format "&lt;types>@&lt;apiVersion>". |
| BCP069     | The function "{function}" is not supported. Use the "{@operator}" operator instead. |
| BCP070     | Argument of type "{argumentType}" is not assignable to parameter of type "{parameterType}". |
| BCP071     | Expected {expected}, but got {argumentCount}. |
| <a id='BCP072' />[BCP072](./diagnostics/bcp072.md) | This symbol cannot be referenced here. Only other parameters can be referenced in parameter default values. |
| <a id='BCP073' />[BCP073](./diagnostics/bcp073.md) | The property &lt;property-name> is read-only. Expressions cannot be assigned to read-only properties. |
| BCP074     | Indexing over arrays requires an index of type "{LanguageConstants.Int}" but the provided index was of type "{wrongType}". |
| BCP075     | Indexing over objects requires an index of type "{LanguageConstants.String}" but the provided index was of type "{wrongType}". |
| BCP076     | Cannot index over expression of type "{wrongType}". Arrays or objects are required. |
| BCP077     | The property "{badProperty}" on type "{type}" is write-only. Write-only properties cannot be accessed. |
| BCP078     | The property "{propertyName}" requires a value of type "{expectedType}", but none was supplied. |
| BCP079     | This expression is referencing its own declaration, which is not allowed. |
| BCP080     | The expression is involved in a cycle ("{string.Join("\" -> \"", cycle)}"). |
| BCP081     | Resource type "{resourceTypeReference.FormatName()}" does not have types available. Bicep is unable to validate resource properties prior to deployment, but this will not block the resource from being deployed. |
| BCP082     | The name "{name}" does not exist in the current context. Did you mean "{suggestedName}"? |
| BCP083     | The type "{type}" does not contain property "{badProperty}". Did you mean "{suggestedProperty}"? |
| BCP084     | The symbolic name "{name}" is reserved. Please use a different symbolic name. Reserved namespaces are {ToQuotedString(namespaces.OrderBy(ns => ns))}. |
| BCP085     | The specified file path contains one ore more invalid path characters. The following are not permitted: {ToQuotedString(forbiddenChars.OrderBy(x => x).Select(x => x.ToString()))}. |
| BCP086     | The specified file path ends with an invalid character. The following are not permitted: {ToQuotedString(forbiddenPathTerminatorChars.OrderBy(x => x).Select(x => x.ToString()))}. |
| BCP087     | Array and object literals are not allowed here. |
| BCP088     | The property "{property}" expected a value of type "{expectedType}" but the provided value is of type "{actualStringLiteral}". Did you mean "{suggestedStringLiteral}"? |
| BCP089     | The property "{property}" is not allowed on objects of type "{type}". Did you mean "{suggestedProperty}"? |
| BCP090     | This module declaration is missing a file path reference. |
| BCP091     | An error occurred reading file. {failureMessage} |
| BCP092     | String interpolation is not supported in file paths. |
| BCP093     | File path "{filePath}" could not be resolved relative to "{parentPath}". |
| BCP094     | This module references itself, which is not allowed. |
| BCP095     | The file is involved in a cycle ("{string.Join("\" -> \"", cycle)}"). |
| BCP096     | Expected a module identifier at this location. |
| BCP097     | Expected a module path string. This should be a relative path to another bicep file, e.g. 'myModule.bicep' or '../parent/myModule.bicep' |
| BCP098     | The specified file path contains a "\" character. Use "/" instead as the directory separator character. |
| BCP099     | The "{LanguageConstants.ParameterAllowedPropertyName}" array must contain one or more items. |
| BCP100     | The function "if" is not supported. Use the "?:\" (ternary conditional) operator instead, e.g. condition ? ValueIfTrue : ValueIfFalse |
| BCP101     | The "createArray" function is not supported. Construct an array literal using []. |
| BCP102     | The "createObject" function is not supported. Construct an object literal using {}. |
| BCP103     | The following token is not recognized: "{token}". Strings are defined using single quotes in bicep. |
| BCP104     | The referenced module has errors. |
| BCP105     | Unable to load file from URI "{fileUri}". |
| BCP106     | Expected a new line character at this location. Commas are not used as separator delimiters. |
| BCP107     | The function "{name}" does not exist in namespace "{namespaceType.Name}". |
| BCP108     | The function "{name}" does not exist in namespace "{namespaceType.Name}". Did you mean "{suggestedName}"? |
| BCP109     | The type "{type}" does not contain function "{name}". |
| BCP110     | The type "{type}" does not contain function "{name}". Did you mean "{suggestedName}"? |
| BCP111     | The specified file path contains invalid control code characters. |
| BCP112     | The "{LanguageConstants.TargetScopeKeyword}" cannot be declared multiple times in one file. |
| BCP113     | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeTenant}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include tenant: tenant(), named management group: managementGroup(&lt;name>), named subscription: subscription(&lt;subId>), or named resource group in a named subscription: resourceGroup(&lt;subId>, &lt;name>). |
| BCP114     | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeManagementGroup}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include current management group: managementGroup(), named management group: managementGroup(&lt;name>), named subscription: subscription(&lt;subId>), tenant: tenant(), or named resource group in a named subscription: resourceGroup(&lt;subId>, &lt;name>). |
| BCP115     | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeSubscription}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include current subscription: subscription(), named subscription: subscription(&lt;subId>), named resource group in same subscription: resourceGroup(&lt;name>), named resource group in different subscription: resourceGroup(&lt;subId>, &lt;name>), or tenant: tenant(). |
| BCP116     | Unsupported scope for module deployment in a "{LanguageConstants.TargetScopeTypeResourceGroup}" target scope. Omit this property to inherit the current scope, or specify a valid scope. Permissible scopes include current resource group: resourceGroup(), named resource group in same subscription: resourceGroup(&lt;name>), named resource group in a different subscription: resourceGroup(&lt;subId>, &lt;name>), current subscription: subscription(), named subscription: subscription(&lt;subId>) or tenant: tenant(). |
| BCP117     | An empty indexer is not allowed. Specify a valid expression. |
| BCP118     | Expected the "{" character, the "[" character, or the "if" keyword at this location. |
| BCP119     | Unsupported scope for extension resource deployment. Expected a resource reference. |
| BCP120     | This expression is being used in an assignment to the "{propertyName}" property of the "{objectTypeName}" type, which requires a value that can be calculated at the start of the deployment. |
| BCP121     | Resources: {ToQuotedString(resourceNames)} are defined with this same name in a file. Rename them or split into different modules. |
| BCP122     | Modules: {ToQuotedString(moduleNames)} are defined with this same name and this same scope in a file. Rename them or split into different modules. |
| BCP123     | Expected a namespace or decorator name at this location. |
| BCP124     | The decorator "{decoratorName}" can only be attached to targets of type "{attachableType}", but the target has type "{targetType}". |
| BCP125     | Function "{functionName}" cannot be used as a parameter decorator. |
| BCP126     | Function "{functionName}" cannot be used as a variable decorator. |
| BCP127     | Function "{functionName}" cannot be used as a resource decorator. |
| BCP128     | Function "{functionName}" cannot be used as a module decorator. |
| BCP129     | Function "{functionName}" cannot be used as an output decorator. |
| BCP130     | Decorators are not allowed here. |
| BCP132     | Expected a declaration after the decorator. |
| BCP133     | The unicode escape sequence is not valid. Valid unicode escape sequences range from \\u{0} to \\u{10FFFF}. |
| BCP134     | Scope {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(suppliedScope))} is not valid for this module. Permitted scopes: {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(supportedScopes))}. |
| BCP135     | Scope {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(suppliedScope))} is not valid for this resource type. Permitted scopes: {ToQuotedString(LanguageConstants.GetResourceScopeDescriptions(supportedScopes))}. |
| BCP136     | Expected a loop item variable identifier at this location. |
| BCP137     | Loop expected an expression of type "{LanguageConstants.Array}" but the provided value is of type "{actualType}". |
| BCP138     | For-expressions are not supported in this context. For-expressions may be used as values of resource, module, variable, and output declarations, or values of resource and module properties. |
| BCP139     | A resource's scope must match the scope of the Bicep file for it to be deployable. You must use modules to deploy resources to a different scope. |
| BCP140     | The multi-line string at this location is not terminated. Terminate it with "'''. |
| BCP141     | The expression cannot be used as a decorator as it is not callable. |
| BCP142     | Property value for-expressions cannot be nested. |
| BCP143     | For-expressions cannot be used with properties whose names are also expressions. |
| BCP144     | Directly referencing a resource or module collection is not currently supported here. Apply an array indexer to the expression. |
| BCP145     | Output "{identifier}" is declared multiple times. Remove or rename the duplicates. |
| BCP147     | Expected a parameter declaration after the decorator. |
| BCP148     | Expected a variable declaration after the decorator. |
| BCP149     | Expected a resource declaration after the decorator. |
| BCP150     | Expected a module declaration after the decorator. |
| BCP151     | Expected an output declaration after the decorator. |
| BCP152     | Function "{functionName}" cannot be used as a decorator. |
| BCP153     | Expected a resource or module declaration after the decorator. |
| BCP154     | Expected a batch size of at least {limit} but the specified value was "{value}". |
| BCP155     | The decorator "{decoratorName}" can only be attached to resource or module collections. |
| BCP156     | The resource type segment "{typeSegment}" is invalid. Nested resources must specify a single type segment, and optionally can specify an API version using the format "&lt;type>@&lt;apiVersion>". |
| BCP157     | The resource type cannot be determined due to an error in the containing resource. |
| BCP158     | Cannot access nested resources of type "{wrongType}". A resource type is required. |
| BCP159     | The resource "{resourceName}" does not contain a nested resource named "{identifierName}". Known nested resources are: {ToQuotedString(nestedResourceNames)}. |
| BCP160     | A nested resource cannot appear inside of a resource with a for-expression. |
| BCP162     | Expected a loop item variable identifier or "(" at this location. |
| BCP164     | A child resource's scope is computed based on the scope of its ancestor resource. This means that using the "scope" property on a child resource is unsupported. |
| BCP165     | A resource's computed scope must match that of the Bicep file for it to be deployable. This resource's scope is computed from the "scope" property value assigned to ancestor resource "{ancestorIdentifier}". You must use modules to deploy resources to a different scope. |
| BCP166     | Duplicate "{decoratorName}" decorator. |
| BCP167     | Expected the "{" character or the "if" keyword at this location. |
| BCP168     | Length must not be a negative value. |
| BCP169     | Expected resource name to contain {expectedSlashCount} "/" character(s). The number of name segments must match the number of segments in the resource type. |
| BCP170     | Expected resource name to not contain any "/" characters. Child resources with a parent resource reference (via the parent property or via nesting) must not contain a fully-qualified name. |
| BCP171     | Resource type "{resourceType}" is not a valid child resource of parent "{parentResourceType}". |
| BCP172     | The resource type cannot be validated due to an error in parent resource "{resourceName}". |
| BCP173     | The property "{property}" cannot be used in an existing resource declaration. |
| BCP174     | Type validation is not available for resource types declared containing a "/providers/" segment. Please instead use the "scope" property. |
| BCP176     | Values of the "any" type are not allowed here. |
| BCP177     | This expression is being used in the if-condition expression, which requires a value that can be calculated at the start of the deployment.{variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP178     | This expression is being used in the for-expression, which requires a value that can be calculated at the start of the deployment.{variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP179     | Unique resource or deployment name is required when looping. The loop item variable "{itemVariableName}" or the index variable "{indexVariableName}" must be referenced in at least one of the value expressions of the following properties in the loop body: {ToQuotedString(expectedVariantProperties)} |
| BCP180     | Function "{functionName}" is not valid at this location. It can only be used when directly assigning to a module parameter with a secure decorator. |
| BCP181     | This expression is being used in an argument of the function "{functionName}", which requires a value that can be calculated at the start of the deployment.{variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP182     | This expression is being used in the for-body of the variable "{variableName}", which requires values that can be calculated at the start of the deployment.{variableDependencyChainClause}{violatingPropertyNameClause}{accessiblePropertiesClause} |
| BCP183     | The value of the module "params" property must be an object literal. |
| BCP184     | File '{filePath}' exceeded maximum size of {maxSize} {unit}. |
| BCP185     | Encoding mismatch. File was loaded with '{detectedEncoding}' encoding. |
| BCP186     | Unable to parse literal JSON value. Please ensure that it is well-formed. |
| BCP187     | The property "{property}" does not exist in the resource or type definition, although it might still be valid.{TypeInaccuracyClause} |
| BCP188     | The referenced ARM template has errors. Please see [https://aka.ms/arm-template](https://aka.ms/arm-template) for information on how to diagnose and fix the template. |
| BCP189     | (allowedSchemes.Contains(ArtifactReferenceSchemes.Local, StringComparer.Ordinal), allowedSchemes.Any(scheme => !string.Equals(scheme, ArtifactReferenceSchemes.Local, StringComparison.Ordinal))) switch { (false, false) => "Module references are not supported in this context.", (false, true) => $"The specified module reference scheme \"{badScheme}\" is not recognized. Specify a module reference using one of the following schemes: {FormatSchemes()}", (true, false) => $"The specified module reference scheme \"{badScheme}\" is not recognized. Specify a path to a local module file.", (true, true) => $"The specified module reference scheme \"{badScheme}\" is not recognized. Specify a path to a local module file or a module reference using one of the following schemes: {FormatSchemes()}"} |
| BCP190     | The artifact with reference "{artifactRef}" has not been restored. |
| BCP191     | Unable to restore the artifact with reference "{artifactRef}". |
| BCP192     | Unable to restore the artifact with reference "{artifactRef}": {message} |
| BCP193     | {BuildInvalidOciArtifactReferenceClause(aliasName, badRef)} Specify a reference in the format of "{ArtifactReferenceSchemes.Oci}:&lt;artifact-uri>:&lt;tag>", or "{ArtifactReferenceSchemes.Oci}/&lt;module-alias>:&lt;module-name-or-path>:&lt;tag>". |
| BCP194     | {BuildInvalidTemplateSpecReferenceClause(aliasName, badRef)} Specify a reference in the format of "{ArtifactReferenceSchemes.TemplateSpecs}:&lt;subscription-ID>/&lt;resource-group-name>/&lt;template-spec-name>:&lt;version>", or "{ArtifactReferenceSchemes.TemplateSpecs}/&lt;module-alias>:&lt;template-spec-name>:&lt;version>". |
| BCP195     | {BuildInvalidOciArtifactReferenceClause(aliasName, badRef)} The artifact path segment "{badSegment}" is not valid. Each artifact name path segment must be a lowercase alphanumeric string optionally separated by a ".", "_", or \"-\"." |
| BCP196     | The module tag or digest is missing. |
| BCP197     | The tag "{badTag}" exceeds the maximum length of {maxLength} characters. |
| BCP198     | The tag "{badTag}" is not valid. Valid characters are alphanumeric, ".", "_", or "-" but the tag cannot begin with ".", "_", or "-". |
| BCP199     | Module path "{badRepository}" exceeds the maximum length of {maxLength} characters. |
| BCP200     | The registry "{badRegistry}" exceeds the maximum length of {maxLength} characters. |
| BCP201     | Expected a provider specification string of with a valid format at this location. Valid formats are "br:&lt;providerRegistryHost>/&lt;providerRepositoryPath>@&lt;providerVersion>" or "br/&lt;providerAlias>:&lt;providerName>@&lt;providerVersion>". |
| BCP202     | Expected a provider alias name at this location. |
| BCP203     | Using provider statements requires enabling EXPERIMENTAL feature "Extensibility". |
| BCP204     | Provider namespace "{identifier}" is not recognized. |
| BCP205     | Provider namespace "{identifier}" does not support configuration. |
| BCP206     | Provider namespace "{identifier}" requires configuration, but none was provided. |
| BCP207     | Namespace "{identifier}" is declared multiple times. Remove the duplicates. |
| BCP208     | The specified namespace "{badNamespace}" is not recognized. Specify a resource reference using one of the following namespaces: {ToQuotedString(allowedNamespaces)}. |
| BCP209     | Failed to find resource type "{resourceType}" in namespace "{@namespace}". |
| BCP210     | Resource type belonging to namespace "{childNamespace}" cannot have a parent resource type belonging to different namespace "{parentNamespace}". |
| BCP211     | The module alias name "{aliasName}" is invalid. Valid characters are alphanumeric, "_", or "-". |
| BCP212     | The Template Spec module alias name "{aliasName}" does not exist in the {BuildBicepConfigurationClause(configFileUri)}. |
| BCP213     | The OCI artifact module alias name "{aliasName}" does not exist in the {BuildBicepConfigurationClause(configFileUri)}. |
| BCP214     | The Template Spec module alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is in valid. The "subscription" property cannot be null or undefined. |
| BCP215     | The Template Spec module alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is in valid. The "resourceGroup" property cannot be null or undefined. |
| BCP216     | The OCI artifact module alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is invalid. The "registry" property cannot be null or undefined. |
| BCP217     | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The subscription ID "{subscriptionId}" is not a GUID. |
| BCP218     | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The resource group name "{resourceGroupName}" exceeds the maximum length of {maximumLength} characters. |
| BCP219     | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The resource group name "{resourceGroupName}" is invalid. Valid characters are alphanumeric, unicode characters, ".", "_", "-", "(", or ")", but the resource group name cannot end with ".". |
| BCP220     | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec name "{templateSpecName}" exceeds the maximum length of {maximumLength} characters. |
| BCP221     | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec name "{templateSpecName}" is invalid. Valid characters are alphanumeric, ".", "_", "-", "(", or ")", but the Template Spec name cannot end with ".". |
| BCP222     | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec version "{templateSpecVersion}" exceeds the maximum length of {maximumLength} characters. |
| BCP223     | {BuildInvalidTemplateSpecReferenceClause(aliasName, referenceValue)} The Template Spec version "{templateSpecVersion}" is invalid. Valid characters are alphanumeric, ".", "_", "-", "(", or ")", but the Template Spec name cannot end with ".". |
| BCP224     | {BuildInvalidOciArtifactReferenceClause(aliasName, badRef)} The digest "{badDigest}" is not valid. The valid format is a string "sha256:" followed by exactly 64 lowercase hexadecimal digits. |
| BCP225     | The discriminator property "{propertyName}" value cannot be determined at compilation time. Type checking for this object is disabled. |
| BCP226     | Expected at least one diagnostic code at this location. Valid format is "#disable-next-line diagnosticCode1 diagnosticCode2 ...". |
| BCP227     | The type "{resourceType}" cannot be used as a parameter or output type. Extensibility types are currently not supported as parameters or outputs. |
| BCP229     | The parameter "{parameterName}" cannot be used as a resource scope or parent. Resources passed as parameters cannot be used as a scope or parent of a resource. |
| BCP300     | Expected a type literal at this location. Please specify a concrete value or a reference to a literal type. |
| BCP301     | The type name "{reservedName}" is reserved and may not be attached to a user-defined type. |
| BCP302     | The name "{name}" is not a valid type. Please specify one of the following types: {ToQuotedString(validTypes)}. |
| BCP303     | String interpolation is unsupported for specifying the provider. |
| BCP304     | Invalid provider specifier string. Specify a valid provider of format "&lt;providerName>@&lt;providerVersion>". |
| BCP305     | Expected the "with" keyword, "as" keyword, or a new line character at this location. |
| BCP306     | The name "{name}" refers to a namespace, not to a type. |
| BCP307     | The expression cannot be evaluated, because the identifier properties of the referenced existing resource including {ToQuotedString(runtimePropertyNames.OrderBy(x => x))} cannot be calculated at the start of the deployment. In this situation, {accessiblePropertyNamesClause}{accessibleFunctionNamesClause}. |
| BCP308     | The decorator "{decoratorName}" may not be used on statements whose declared type is a reference to a user-defined type. |
| BCP309     | Values of type "{flattenInputType.Name}" cannot be flattened because "{incompatibleType.Name}" is not an array type. |
| BCP311     | The provided index value of "{indexSought}" is not valid for type "{typeName}". Indexes for this type must be between 0 and {tupleLength - 1}. |
| BCP315     | An object type may have at most one additional properties declaration. |
| BCP316     | The "{LanguageConstants.ParameterSealedPropertyName}" decorator may not be used on object types with an explicit additional properties type declaration. |
| BCP317     | Expected an identifier, a string, or an asterisk at this location. |
| BCP318     | The value of type "{possiblyNullType}" may be null at the start of the deployment, which would cause this access expression (and the overall deployment with it) to fail. If you do not know whether the value will be null and the template would handle a null value for the overall expression, use a `.?` (safe dereference) operator to short-circuit the access expression if the base expression's value is null: {accessExpression.AsSafeAccess().ToString()}. If you know the value will not be null, use a non-null assertion operator to inform the compiler that the value will not be null: {SyntaxFactory.AsNonNullable(expression).ToString()}. |
| BCP319     | The type at "{errorSource}" could not be resolved by the ARM JSON template engine. Original error message: "{message}" |
| BCP320     | The properties of module output resources cannot be accessed directly. To use the properties of this resource, pass it as a resource-typed parameter to another module and access the parameter's properties therein. |
| BCP321     | Expected a value of type "{expectedType}" but the provided value is of type "{actualType}". If you know the value will not be null, use a non-null assertion operator to inform the compiler that the value will not be null: {SyntaxFactory.AsNonNullable(expression).ToString()}. |
| BCP322     | The `.?` (safe dereference) operator may not be used on instance function invocations. |
| BCP323     | The `[?]` (safe dereference) operator may not be used on resource or module collections. |
| BCP325     | Expected a type identifier at this location. |
| BCP326     | Nullable-typed parameters may not be assigned default values. They have an implicit default of 'null' that cannot be overridden. |
| <a id='BCP327' />[BCP327](./diagnostics/bcp327.md) | The provided value (which will always be greater than or equal to &lt;value>) is too large to assign to a target for which the maximum allowable value is &lt;max-value>. |
| <a id='BCP328' />[BCP328](./diagnostics/bcp328.md) | The provided value (which will always be less than or equal to &lt;value>) is too small to assign to a target for which the minimum allowable value is &lt;max-value>. |
| BCP329     | The provided value can be as small as {sourceMin} and may be too small to assign to a target with a configured minimum of {targetMin}. |
| BCP330     | The provided value can be as large as {sourceMax} and may be too large to assign to a target with a configured maximum of {targetMax}. |
| BCP331     | A type's "{minDecoratorName}" must be less than or equal to its "{maxDecoratorName}", but a minimum of {minValue} and a maximum of {maxValue} were specified. |
| <a id='BCP332' />[BCP332](./diagnostics/bcp332.md) | The provided value (whose length will always be greater than or equal to &lt;string-length>) is too long to assign to a target for which the maximum allowable length is &lt;max-length>. |
| <a id='BCP333' />[BCP333](./diagnostics/bcp333.md) | The provided value (whose length will always be less than or equal to &lt;string-length>) is too short to assign to a target for which the minimum allowable length is &lt;min-length>. |
| BCP334     | The provided value can have a length as small as {sourceMinLength} and may be too short to assign to a target with a configured minimum length of {targetMinLength}. |
| BCP335     | The provided value can have a length as large as {sourceMaxLength} and may be too long to assign to a target with a configured maximum length of {targetMaxLength}. |
| BCP337     | This declaration type is not valid for a Bicep Parameters file. Specify a "{LanguageConstants.UsingKeyword}", "{LanguageConstants.ParameterKeyword}" or "{LanguageConstants.VariableKeyword}" declaration. |
| BCP338     | Failed to evaluate parameter "{parameterName}": {message} |
| BCP339     | The provided array index value of "{indexSought}" is not valid. Array index should be greater than or equal to 0. |
| BCP340     | Unable to parse literal YAML value. Please ensure that it is well-formed. |
| BCP341     | This expression is being used inside a function declaration, which requires a value that can be calculated at the start of the deployment. {variableDependencyChainClause}{accessiblePropertiesClause} |
| BCP342     | User-defined types are not supported in user-defined function parameters or outputs. |
| BCP344     | Expected an assert identifier at this location. |
| BCP345     | A test declaration can only reference a Bicep File |
| BCP0346    | Expected a test identifier at this location. |
| BCP0347    | Expected a test path string at this location. |
| BCP348     | Using a test declaration statement requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.TestFramework)}". |
| BCP349     | Using an assert declaration requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.Assertions)}". |
| BCP350       | Value of type "{valueType}" cannot be assigned to an assert. Asserts can take values of type 'bool' only. |
| BCP351       | Function "{functionName}" is not valid at this location. It can only be used when directly assigning to a parameter. |
| BCP352       | Failed to evaluate variable "{name}": {message} |
| BCP353       | The {itemTypePluralName} {ToQuotedString(itemNames)} differ only in casing. The ARM deployments engine is not case sensitive and will not be able to distinguish between them. |
| BCP354       | Expected left brace ('{') or asterisk ('*') character at this location. |
| BCP355       | Expected the name of an exported symbol at this location. |
| BCP356       | Expected a valid namespace identifier at this location. |
| BCP358       | This declaration is missing a template file path reference. |
| BCP360       | The '{symbolName}' symbol was not found in (or was not exported by) the imported template. |
| BCP361       | The "@export()" decorator must target a top-level statement. |
| BCP362       | This symbol is imported multiple times under the names {string.Join(", ", importedAs.Select(identifier => $"'{identifier}'"))}. |
| BCP363       | The "{LanguageConstants.TypeDiscriminatorDecoratorName}" decorator can only be applied to object-only union types with unique member types. |
| BCP364       | The property "{discriminatorPropertyName}" must be a required string literal on all union member types. |
| BCP365       | The value "{discriminatorPropertyValue}" for discriminator property "{discriminatorPropertyName}" is duplicated across multiple union member types. The value must be unique across all union member types. |
| BCP366       | The discriminator property name must be "{acceptablePropertyName}" on all union member types. |
| BCP367       | The "{featureName}" feature is temporarily disabled. |
| BCP368       | The value of the "{targetName}" parameter cannot be known until the template deployment has started because it uses a reference to a secret value in Azure Key Vault. Expressions that refer to the "{targetName}" parameter may be used in {LanguageConstants.LanguageFileExtension} files but not in {LanguageConstants.ParamsFileExtension} files. |
| BCP369       | The value of the "{targetName}" parameter cannot be known until the template deployment has started because it uses the default value defined in the template. Expressions that refer to the "{targetName}" parameter may be used in {LanguageConstants.LanguageFileExtension} files but not in {LanguageConstants.ParamsFileExtension} files. |
| BCP372       | The "@export()" decorator may not be applied to variables that refer to parameters, modules, or resource, either directly or indirectly. The target of this decorator contains direct or transitive references to the following unexportable symbols: {ToQuotedString(nonExportableSymbols)}. |
| BCP373       | Unable to import the symbol named "{name}": {message} |
| BCP374       | The imported model cannot be loaded with a wildcard because it contains the following duplicated exports: {ToQuotedString(ambiguousExportNames)}. |
| BCP375       | An import list item that identifies its target with a quoted string must include an 'as &lt;alias>' clause. |
| BCP376       | The "{name}" symbol cannot be imported because imports of kind {exportMetadataKind} are not supported in files of kind {sourceFileKind}. |
| BCP377       | The provider alias name "{aliasName}" is invalid. Valid characters are alphanumeric, "_", or "-". |
| BCP378       | The OCI artifact provider alias "{aliasName}" in the {BuildBicepConfigurationClause(configFileUri)} is invalid. The "registry" property cannot be null or undefined. |
| BCP379       | The OCI artifact provider alias name "{aliasName}" does not exist in the {BuildBicepConfigurationClause(configFileUri)}. |
| BCP380       | Artifacts of type: "{artifactType}" are not supported. |
| BCP381       | Declaring provider namespaces with the "import" keyword has been deprecated. Please use the "provider" keyword instead. |
| BCP383       | The "{typeName}" type is not parameterizable. |
| BCP384       | The "{typeName}" type requires {requiredArgumentCount} argument(s). |
| BCP385       | Using resource-derived types requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.ResourceDerivedTypes)}". |
| BCP386       | The decorator "{decoratorName}" may not be used on statements whose declared type is a reference to a resource-derived type. |
| BCP387       | Indexing into a type requires an integer greater than or equal to 0. |
| BCP388       | Cannot access elements of type "{wrongType}" by index. A tuple type is required. |
| BCP389       | The type "{wrongType}" does not declare an additional properties type. |
| BCP390       | The array item type access operator ('[*]') can only be used with typed arrays. |
| BCP391       | Type member access is only supported on a reference to a named type. |
| BCP392       | "The supplied resource type identifier "{resourceTypeIdentifier}" was not recognized as a valid resource type name." |
| BCP393       | "The type pointer segment "{unrecognizedSegment}" was not recognized. Supported pointer segments are: "properties", "items", "prefixItems", and "additionalProperties"." |
| BCP394       | Resource-derived type expressions must derefence a property within the resource body. Using the entire resource body type is not permitted. |
| BCP395       | Declaring provider namespaces using the '&lt;providerName>@&lt;version>' expression has been deprecated. Please use an identifier instead. |
| BCP396       | The referenced provider types artifact has been published with malformed content. |
| BCP397       | "Provider {name} is incorrectly configured in the {BuildBicepConfigurationClause(configFileUri)}. It is referenced in the "{RootConfiguration.ImplicitProvidersConfigurationKey}" section, but is missing corresponding configuration in the "{RootConfiguration.ProvidersConfigurationKey}" section." |
| BCP398       | "Provider {name} is incorrectly configured in the {BuildBicepConfigurationClause(configFileUri)}. It is configured as built-in in the "{RootConfiguration.ProvidersConfigurationKey}" section, but no built-in provider exists." |
| BCP399       | Fetching az types from the registry requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.DynamicTypeLoading)}". |
| BCP400       | Fetching types from the registry requires enabling EXPERIMENTAL feature "{nameof(ExperimentalFeaturesEnabled.ProviderRegistry)}". |

## Next steps

To learn about Bicep, see [Bicep overview](./overview.md).
