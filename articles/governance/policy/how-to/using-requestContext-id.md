# Use requestContext().identity to return caller identity in Azure Policy

If you have ever wanted Azure Policy to behave differently based on *who* (or *what*) made a
request, `requestContext().identity` is the function you need.

This function lets you inspect caller identity information at policy evaluation time, so you can
write policies such as:

- allow only user-initiated changes for sensitive resource types
- block updates from unapproved client applications
- require stronger sign-in context (for example, MFA indicators) before specific operations

## Why this function matters

Most policy rules evaluate the target resource payload. That is great for enforcing configuration,
but it does not tell you anything about the caller.

`requestContext().identity` fills that gap by exposing request identity metadata in policy rule
expressions.

At a high level, you can evaluate:

- `idtyp`: caller identity type (`app`, `user`, or `null`)
- `appid`: client application ID used for the request
- `acrs`: authentication context class references (used to inspect sign-in context, such as MFA-related values)
- `http://schemas.microsoft.com/identity/claims/objectidentifier`: caller object ID (user or service principal object identifier)

> [!IMPORTANT] When you use `requestContext().identity`, Azure Policy enforcement still occurs at
> request time (for example, `deny`, `modify`, and `deployIfNotExists`). However, compliance scans
> for that policy are marked as `NotApplicable`. This pattern is best when your goal is real-time
> enforcement on incoming create/update operations, not post-deployment compliance reporting.

## Pattern: safely read identity fields with tryGet

Identity claims may be absent for some requests. Use `tryGet()` so your expression does not fail
when a key is missing.

Example:

```json
{
	"value": "[tryGet(requestContext().identity, 'idtyp')]",
	"equals": "user"
}
```

## Example 1: deny user callers for Key Vault resource types

This policy rule denies write operations when the caller identity type is `user`
for Key Vault resource types.

```json
{
	"mode": "All",
	"policyRule": {
		"if": {
			"allOf": [
				{
					"field": "type",
					"like": "Microsoft.KeyVault/*"
				},
				{
					"value": "[tryGet(requestContext().identity, 'idtyp')]",
					"equals": "user"
				}
			]
		},
		"then": {
			"effect": "deny"
		}
	}
}
```

Use this pattern when you want to block interactive users from changing Key Vault resources while still allowing non-user identities.

## Example 2: allow only approved client apps

This example restricts writes to requests coming from a known allowlist of client app IDs.

```json
{
	"mode": "All",
	"parameters": {
		"allowedClientAppIds": {
			"type": "Array",
			"metadata": {
				"displayName": "Allowed client application IDs",
				"description": "List of Entra app IDs permitted to perform write operations."
			}
		}
	},
	"policyRule": {
		"if": {
			"allOf": [
				{
					"field": "type",
					"like": "Microsoft.Network/*"
				},
				{
					"value": "[tryGet(requestContext().identity, 'appid')]",
					"notIn": "[parameters('allowedClientAppIds')]"
				}
			]
		},
		"then": {
			"effect": "deny"
		}
	}
}
```

This is useful for guarding automation boundaries so only approved deployment tooling can modify
selected resource providers.

## Example 3: inspect MFA-related auth context

The `acrs` claim can include multiple comma-separated values. Use `split()` to evaluate them.

```json
{
	"if": {
		"allOf": [
			{
				"field": "type",
				"equals": "Microsoft.Authorization/roleAssignments"
			},
			{
				"value": "p1",
				"notIn": "[split(tryGet(requestContext().identity, 'acrs'), ',')]"
			}
		]
	},
	"then": {
		"effect": "deny"
	}
}
```

The exact `acrs` values depend on your identity and conditional access design, so validate the expected values in your tenant before broad rollout.

## Example 4: scope by specific caller object IDs

You can inspect object identifier claims for precise allow/deny logic:

```json
{
	"if": {
		"allOf": [
			{
				"field": "type",
				"equals": "Microsoft.Resources/subscriptions/resourceGroups"
			},
			{
				"value": "[tryGet(requestContext().identity, 'http://schemas.microsoft.com/identity/claims/objectidentifier')]",
				"notIn": "[parameters('approvedObjectIds')]"
			}
		]
	},
	"then": {
		"effect": "deny"
	}
}
```

This pattern is strict and explicit, but it requires good operational hygiene to keep identity lists current.

## Design tips before production rollout

- Start with `audit` or assign with enforcement disabled to validate behavior before enforcing `deny`.
- Use `tryGet()` for every identity claim access to avoid evaluation failures from missing keys.
- Pilot at a narrow scope (single subscription or management group branch) before broad assignment. To learn more about staged rollout best practices, see [Safe deployment of Azure Policy assignments](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/policy-safe-deployment-practices).
- Communicate clearly with platform and security teams that compliance state will be `NotApplicable` for these policies.
- Pair identity-based rules with resource-configuration policies for layered governance.

## Troubleshooting checklist

- Unexpected denies:
	- confirm the evaluated identity key exists (`idtyp`, `appid`, `acrs`, object identifier)
	- verify value casing and list delimiters when parsing `acrs`
- Policy appears not compliant in reports:
	- expected behavior is `NotApplicable` for compliance scans when using `requestContext().identity`
- Automation breakage:
	- check if the automation client `appid` was added to your allowed list

## Wrap-up

`requestContext().identity` gives Azure Policy request-time awareness of caller identity so you can
govern *who* can perform changes, not just *what* the resource should look like.

Used carefully, it is a strong control for high-impact operations, especially when combined with
standard configuration policies and staged rollout practices.
