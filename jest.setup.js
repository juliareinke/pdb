jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),

    Swipeable: jest.fn(),
    GestureHandlerRootView: ({ children }) => children,
    State: {},
    Directions: {},
    PanGestureHandler: jest.fn(),
    BaseButton: jest.fn(),
    RectButton: jest.fn(),
    TapGestureHandler: jest.fn(),
    ...jest.requireActual('react-native-gesture-handler'),
  }));