# Test Components

These components exist to verify the MDX pipeline during development. They are not for production use.

| Component   | Tests                                                                              |
| ----------- | ---------------------------------------------------------------------------------- |
| `Counter`   | Client hydration — stateful counter confirms `client:load` works with no flash     |
| `Callout`   | Nested children — wraps mixed content including other components                   |
| `PropTable` | Complex props — arrays and objects passed through MDX expressions                  |
| `CodeBlock` | Stateful interaction — copy button confirms client-side state works in SSR context |
| `LazyChart` | Async rendering — fetch failure renders fallback, confirming error path works      |
