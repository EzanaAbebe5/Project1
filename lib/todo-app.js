var initial_model = {
    todos: [],
    hash: "#/"
}

function update(action, model, data){
    var new_model = JSON.parse(JSON.stringify(model))
    switch(action){
        case 'ADD':
            new_model.todos.push({
                id: model.todos.length + 1,
                title: data,
                done: false
            });
            break;
        case 'TOGGLE':
            new_model.todos.forEach(function(item){
                if(item.id === data){
                    item.done = !item.done;
                }
            });
            break;
        default:
            return model;
    }
    return new_model;
}

if (typeof require !== 'undefined' && this.window !== this) {
  var { a, button, div, empty, footer, input, h1, header, label, li, mount,
    route, section, span, strong, text, ul } = require('./elmish.js');
}

function render_item(item) {
  return (
    li([
      "data-id=" + item.id,
      "id=" + item.id,
      item.done ? "class=completed" : ""
    ], [
      div(["class=view"], [
        input(["class=toggle", "type=checkbox",
          (item.done ? "checked=true" : "")], []),
        label([], [text(item.title)]),
        button(["class=destroy"])
      ])
    ]) 
  )
}

function render_main (model, signal) {
  var display = "style=display:"
    + (model.todos && model.todos.length > 0 ? "block" : "none");

  return (
    section(["class=main", "id=main", display], [ 
      input(["id=toggle-all", "type=checkbox",
        typeof signal === 'function' ? signal('TOGGLE_ALL') : '',
        (model.all_done ? "checked=checked" : ""),
        "class=toggle-all"
      ], []),
      label(["for=toggle-all"], [ text("Mark all as complete") ]),
      ul(["class=todo-list"],
        (model.todos && model.todos.length > 0) ?
        model.todos
        .filter(function (item) {
          switch(model.hash) {
            case '#/active':
              return !item.done;
            case '#/completed':
              return item.done;
            default: 
              return item;
          }
        })
        .map(function (item) {
          return render_item(item, model, signal)
        }) : null
      ) 
    ]) 
  )
}

function render_footer(model, signal) {
  var done = (model.todos && model.todos.length > 0) ?
    model.todos.filter(function (i) { return i.done; }).length : 0;

  var count = (model.todos && model.todos.length > 0) ?
    model.todos.filter(function (i) { return !i.done; }).length : 0;

  var display = (count > 0 || done > 0) ? "block" : "none";
  var display_clear = (done > 0) ? "block;" : "none;";
  var left = (" item" + (count > 1 || count === 0 ? 's' : '') + " left");

  return (
    footer(["class=footer", "id=footer", "style=display:" + display], [
      span(["class=todo-count", "id=count"], [
        strong(count),
        text(left)
      ]),
      ul(["class=filters"], [
        li([], [
          a([
            "href=#/", "id=all", "class=" +
            (model.hash === '#/' ? "selected" : '')
          ], [text("All")])
        ]),
        li([], [
          a([
            "href=#/active", "id=active", "class=" +
            (model.hash === '#/active' ? "selected" : '')
          ], [text("Active")])
        ]),
        li([], [
          a([
            "href=#/completed", "id=completed", "class=" +
            (model.hash === '#/completed' ? "selected" : '')
          ], [text("Completed")])
        ])
      ]),
      button([
        "class=clear-completed",
        "style=display:" + display_clear,
        typeof signal === 'function' ? signal('CLEAR_COMPLETED') : ''
      ], [
        text("Clear completed") 
      ])
    ])
  )
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = {
        model: initial_model,
        update: update,
        render_item: render_item,
        render_main: render_main,
        render_footer: render_footer,
    }
}

