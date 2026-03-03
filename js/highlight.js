/**
 * Apple Component Gallery — Swift Syntax Highlighter
 * Lightweight syntax highlighting for Swift code snippets
 */

window.highlightSwift = function(code) {
  // Escape HTML first
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments (must be first to prevent other rules from matching inside comments)
  result = result.replace(
    /(\/\/.*)/g,
    '<span class="cm">$1</span>'
  );

  // Strings
  result = result.replace(
    /(".*?")/g,
    '<span class="str">$1</span>'
  );

  // Swift keywords & SwiftUI views
  result = result.replace(
    /\b(struct|var|let|func|if|else|return|import|some|in|for|case|switch|default|guard|where|try|catch|throws|async|await|true|false|nil|self|Self|mutating|static|private|public|internal|fileprivate|open|override|final|class|enum|protocol|extension|typealias|associatedtype|init|deinit|subscript|convenience|required|dynamic|lazy|optional|indirect|inout|operator|precedencegroup|do|while|repeat|break|continue|fallthrough|throw|rethrows|defer|is|as|Any|AnyObject|Type|super)\b/g,
    '<span class="kw">$1</span>'
  );

  // SwiftUI types & views
  result = result.replace(
    /\b(Button|Text|Image|VStack|HStack|ZStack|List|NavigationStack|NavigationSplitView|Section|Toggle|Picker|Spacer|Divider|Label|Menu|Form|TabView|Tab|ScrollView|LazyVStack|LazyVGrid|LazyHGrid|Group|GroupBox|ProgressView|DatePicker|Slider|Stepper|ColorPicker|Map|VideoPlayer|TimelineView|OutlineGroup|DisclosureGroup|ShareLink|PhotosPicker|Gauge|ControlGroup|ContentUnavailableView|Circle|RoundedRectangle|Capsule|AsyncImage|ForEach|Grid|GridItem|Table|TableColumn|TextEditor|TextField|Marker|UserAnnotation|ToolbarItem|ToolbarItemGroup|NavigationLink|Link|AVPlayer|Widget|StaticConfiguration|WidgetView)\b/g,
    '<span class="type">$1</span>'
  );

  // Modifiers (dot-prefixed)
  result = result.replace(
    /\.([\w]+)/g,
    '.<span class="kw">$1</span>'
  );

  return result;
};
