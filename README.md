# Github Deployment Action

Install the dependencies

```bash
yarn install
```

Build the typescript

```bash
yarn build
```

Run the tests :heavy_check_mark:

```bash
yarn test
```

## Usage

Create github deployment

```yaml
- name: Create deployment
  uses: minddocdev/github-deployment-action@master
  with:
    token: ${{ github.token }}
    ref: master
    payload: '
      {
        "app": "myApp"
      }
    '
    environment: staging
    description: myApp staging deployment
    required_contexts: '[]'
```
