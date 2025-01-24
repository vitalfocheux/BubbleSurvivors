titre bubble survivors
```html
<!-- From Uiverse.io by LilaRest --> 
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">B</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">u</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">b</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">b</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">l</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">e</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner"></div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">S</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">u</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">r</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">v</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">i</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">v</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">o</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">r</div>
</div>
<div class="bubble">
  <div class="card-overlay"></div>
  <div class="card-inner">s</div>
</div>
```

```css
.bubble {
    border-radius: 50%;
    background: linear-gradient(145deg, #e0f9ff, #bcd2e6);
    box-shadow:  41px 41px 82px #8c9cab,
                 -41px -41px 82px #ffffff;
    }
    
    .card-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-conic-gradient(var(--bg) 0.0000001%, var(--grey) 0.000104%) 60% 60%/600% 600%;
      filter: opacity(10%) contrast(105%);
    }
    
    .card-inner {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 50px;
      height: 50px;
      background-color: var(--contrast);
      border-radius: 30px;
      /* Content style */
      font-size: 30px;
      font-weight: 900;
      color: #c7c4c4;
      text-align: center;
      font-family: monospace;
    }
```