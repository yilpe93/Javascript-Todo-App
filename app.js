var modelController = (function () {
  var todoItems = [];
  
  return {
    addItem: function(value) {
      var id;
      todoItems.push(value);
      id = todoItems.length - 1;
      localStorage.setItem(id, value);
    },

    deleteItem: function (obj) {
      todoItems.splice(obj.id, 1);
      localStorage.removeItem(obj.id);
    },

    getTodoItems: function() {
      return todoItems;
    }
  }
})();

var viewController = (function () {
  var DOMstrings = {
    inputValue: 'input[type="text"]',
    addBtn: '.addContainer',
    itemList: '.item-list',
    listSection: '.list-section',
    removeBtn: '.removeBtn',
    clearAllBtn: '.clearAllBtn'
  }

  return {
    getDOMstrings: function() {
      return DOMstrings;
    },

    getInput: function() {
      return document.querySelector(DOMstrings.inputValue).value;
    },

    addListItem: function(value, id) {
      var html, newHtml;
      
      // obj = localStorage;

      html = `<li data-id="%id%" class="shadow">
      <i class="checkBtn fa fa-check" aria-hidden="true"></i>%value%<span class="removeBtn"><i class="fa fa-trash-o" aria-hidden="true"></i></span></li >`;
      newHtml = html.replace('%value%', value);
      newHtml = newHtml.replace('%id%', id);
      newHtml.split("↵").join("");

      document.querySelector(DOMstrings.itemList).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(id) {
      var el = document.querySelector('[data-id="' + id + '"]');
      el.parentNode.removeChild(el);
    },
    
    clearAll: function() {
      localStorage.clear();
      var parent = document.querySelector(DOMstrings.itemList);
      while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
      }
    },
    
    clearFields: function() {
      var field;
      field = document.querySelector(DOMstrings.inputValue);
      field.value = '';
      field.focus();
    },
  }
})();

var controller = (function(modelCtrl, viewCtrl) {
  var setup = function () {
    var DOM = viewCtrl.getDOMstrings();

    if (localStorage.length > 0) {
      console.log('LocalStorage has item.');
      var todoItems = modelCtrl.getTodoItems();
      for (var i = 0; i < localStorage.length; i++) {
        // console.log(localStorage.length);
        var item = localStorage.getItem(localStorage.key(i));
        todoItems.push(item);
        viewCtrl.addListItem(item, i);
      }
    }

    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

    document.querySelector(DOM.inputValue).addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.listSection).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.clearAllBtn).addEventListener('click', ctrlClear);
  };

  var ctrlAddItem = function(e) {
    var input;
    input = viewCtrl.getInput();

    if (input !== "" || input.length !== 0) {
      newItem = modelCtrl.addItem(input);

      viewCtrl.addListItem(input);

      viewCtrl.clearFields();
    }
  }

  var ctrlDeleteItem = function(event) {
    var id, value;
    
    id = event.target.parentNode.parentNode.dataset.id;
   
    if (id) {
      value = event.target.parentNode.parentNode.innerText;
      
      modelCtrl.deleteItem({id, value});
      
      viewCtrl.deleteListItem(id);
    }
  };

  var ctrlClear = function() {
    viewCtrl.clearAll();
  }

  return {
    init: function() {
      console.log('Application has started.');
      setup();
    }
  }
})(modelController, viewController);

controller.init();