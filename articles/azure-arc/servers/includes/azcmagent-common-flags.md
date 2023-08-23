**Common flags available for all commands**

`--config`

Takes in a path to a JSON or YAML file containing inputs to the command. The configuration file should contain a series of key-value pairs where the key matches an available command line option. For example, to pass in the `--verbose` flag, the configuration file would look like:

```json
{
    "verbose": true
}
```

If a command line option is found in both the command invocation and a configuration file, the value specified on the command line will take precedence.

`-h`, `--help`

Get help for the current command, including its syntax and command line options.

`-j`, `--json`

Output the command result in the JSON format.

`--log-stderr`

Redirect error and verbose messages to the standard error (stderr) stream. By default, all output is sent to the standard output (stdout) stream.

`--no-color`

Disable color output for terminals that do not support ANSI colors.

`-v`, `--verbose`

Show more detailed logging information while the command executes. Useful for troubleshooting issues when running a command.
