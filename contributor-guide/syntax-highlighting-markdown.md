# Syntax highlighting for code snippets in Markdown

Fenced code blocks are an easy way to enable syntax highlighting for your code snippets. The general format for fenced code blocks is:

    ```alias
    ...
    your code goes in here
    ...
    ```

The alias after the initial three '`' characters defines the syntax highlighting to be used. The following is a list of commonly used programming languages on the Azure platform and the matching label:

| Language or CLI | Language alias |
| ------- | ------- |
| Azure CLI | azurecli |
| AzCopy | azcopy |
| C++ | cpp |
| C# | csharp |
| F# | fsharp |
| Java | java|
| JavaScript | javascript |
| JSON | json |
| NodeJS | nodejs |
| Objective-C | objc |
| PHP | php |
| PowerShell | powershell |
| Python | python |
| Ruby | ruby |
| SQL / T-SQL | sql |
| Swift | swift |
| VB | vb |
| XAML | xaml |
| XML | xml |

For a full list of languages that are supported, see [Language names and aliases](http://highlightjs.readthedocs.io/en/latest/css-classes-reference.html#language-names-and-aliases)...

## Example: C\#

__Markdown__

    ```csharp
    // Hello1.cs
    public class Hello1
    {
        public static void Main()
        {
            System.Console.WriteLine("Hello, World!");
        }
    }
    ```

__Render__

```csharp
// Hello1.cs
public class Hello1
{
    public static void Main()
    {
        System.Console.WriteLine("Hello, World!");
    }
}
```

## Example: SQL

__Markdown__

    ```sql
    CREATE TABLE T1 (
      c1 int PRIMARY KEY,
      c2 varchar(50) SPARSE NULL
    );
    ```

__Render__

```sql
CREATE TABLE T1 (
  c1 int PRIMARY KEY,
  c2 varchar(50) SPARSE NULL
);
```