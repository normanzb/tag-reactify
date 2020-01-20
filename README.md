# Tag Reactify

It takes a string with `<Tag/>`s, safely converts tags into renderable react dom according specified tag-react mapping

## Install

```
npm install tag-reactify
```

## Example

Given a text copy as below

```
Open source input masking library that formats the content of input box on-the-fly according the best match in an array of patterns.<Break />
The challenge of building this lib was to differentiate user input from masking characters as they are all mixed up inside the input box, also because there are numerous ways out there for the user to change the value of input box, such as drag and drop, copy and paste, autocomplete etc... typical method of key stroke monitoring won't help here.<Break />
So in instead the lib employed a diff-and-apply-patch mechanism, compare `input.value` against last-used best match pattern, to figure out the true user inputs, and then reformat it against the new best match pattern to generate the masked result and put it back to `input.value`.<Break />The lib is open sourced here: <Link>https://github.com/normanzb/chuanr/</Link>
```

Below module replaces `<Link />` and `<Break />` in the copy into actual breaks and link:

```javascript
import TagReactify from "tag-reactify"

let Comp = function (props) {
    let { description } = props
    return <div>
        {TagReactify(description, {
            Break: function() {
                return <React.Fragment><br /><br /></React.Fragment>
            },
            Link: function ({children}) {
                return <a href={children}>{children}</a>
            }
        })}
    </div>
}

export { Comp as default }
```