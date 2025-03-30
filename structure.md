# Адаптер

```ts
class ServerResponse {
    constructor() {
        this.entries = [
            {
                user_name: 'Александр',
                email_address: 'some@site.com',
                ID: 'уникальный id'
            },
            {
                user_name: 'Мария',
                email_address: 'some@other-site.com',
                ID: 'другой уникальный id'
            }
        ];
    }
}

class UserDataAdapter {
    constructor(response) {
        this.response = response;
    }

    adapt() {
        return this.response.entries.map((entry) => ({
            userName: entry.user_name,
            email: entry.email_address,
            id: entry.ID
        }));
    }
}

const serverResponse = new ServerResponse();
const adapter = new UserDataAdapter(serverResponse);
const adaptedUsers = adapter.adapt();
```

## Для чего нужен этот паттерн?

Адаптер - это структурный паттерн проектирования, который позволяет использовать несовместимые объекты вместе. Он создает интерфейс между двумя объектами, которые не могут работать напрямую из-за различий в их интерфейсах.

## В каких случаях стоит использовать?

1. **Интеграция старого кода с новым**
    - Когда нужно использовать устаревшие компоненты в современной системе
    - При работе с legacy-кодом
    - При интеграции с устаревшими API

2. **Работа с внешними библиотеками**
    - Когда требуется интеграция с библиотеками, имеющими несовместимые интерфейсы
    - При работе с API третьих сторон
    - При необходимости использования компонентов с разными интерфейсами

3. **Объединение компонентов**
    - Когда нужно соединить системы, не предназначенные для совместной работы
    - При интеграции компонентов с разными архитектурами
    - При необходимости поддержки разных версий API

## Какие плюсы?

- Отделяет и скрывает от клиента подробности преобразования различных интерфейсов.

1. **Переиспользование кода**
    - Возможность использовать существующий код без его изменения
    - Сохранение функциональности старых компонентов
    - Экономия времени на разработку

2. **Декаплинг**
    - Отделение клиентского кода от адаптируемого
    - Возможность изменять адаптируемый компонент без влияния на клиент
    - Упрощение поддержки кода

3. **Гибкость**
    - Легкое добавление новых адаптеров
    - Возможность поддержки разных версий компонентов
    - Простая замена адаптеров при необходимости

## Какие недостатки?

- Усложняет код программы из-за введения дополнительных классов.

1. **Дополнительная сложность**
    - Увеличение количества классов в системе
    - Сложность отслеживания взаимосвязей между компонентами
    - Риск усложнения архитектуры

2. **Производительность**
    - Дополнительные накладные расходы на вызовы методов
    - Возможные проблемы с производительностью при сложных преобразованиях
    - Задержки при обработке данных

3. **Ограничения**
    - Сложность поддержки при большом количестве адаптеров
    - Риск чрезмерного использования паттерна
    - Ограничения, связанные с возможностями языка программирования

# Декоратор

```ts
interface FormComponent {
    submit(data: any): Promise<void>;
    render(): string;
}

class BasicForm implements FormComponent {
    private formData: any = {};

    submit(data: any): Promise<void> {
        this.formData = data;
        return Promise.resolve();
    }

    render(): string {
        return `<form>
            <input type="text" name="username" />
            <button type="submit">Отправить</button>
        </form>`;
    }
}

class WithLoadingDecorator implements FormComponent {
    private component: FormComponent;

    constructor(component: FormComponent) {
        this.component = component;
    }

    async submit(data: any): Promise<void> {
        console.log('Начало загрузки...');
        await this.component.submit(data);
        console.log('Загрузка завершена');
    }

    render(): string {
        return `
            <div class="form-container">
                ${this.component.render()}
                <div class="loading-indicator" style="display: none;">
                    Загрузка...
                </div>
            </div>
        `;
    }
}

class WithErrorHandlingDecorator implements FormComponent {
    private component: FormComponent;

    constructor(component: FormComponent) {
        this.component = component;
    }

    async submit(data: any): Promise<void> {
        try {
            await this.component.submit(data);
            console.log('Форма успешно отправлена');
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        }
    }

    render(): string {
        return `
            <div class="form-container">
                ${this.component.render()}
                <div class="error-message" style="display: none; color: red;">
                    Произошла ошибка при отправке
                </div>
            </div>
        `;
    }
}

const basicForm = new BasicForm();
const formWithLoading = new WithLoadingDecorator(basicForm);
const formWithLoadingAndErrors = new WithErrorHandlingDecorator(formWithLoading);

formWithLoadingAndErrors.submit({ username: 'test' });
```

## Для чего нужен этот паттерн?

Декоратор - это структурный паттерн проектирования, который позволяет динамически добавлять новые обязанности объекту, не изменяя его структуру

## В каких случаях стоит использовать?

1. **Динамическое добавление функций**
    - Когда нужно добавлять новые возможности объекту во время выполнения
    - При необходимости создания различных комбинаций функций
    - Когда расширение через наследование невозможно

2. **Избежание множественного наследования**:
    - В языках без поддержки множественного наследования
    - При необходимости комбинировать несколько функций
    - Когда нужно избежать "болотной архитектуры"

3. **Отдельное представление и поведение**:
    - При необходимости разделения ответственности
    - Когда нужно изменять поведение без изменения класса
    - При работе с внешними библиотеками

## Какие плюсы?

- Большая гибкость, чем у наследования.
- Позволяет добавлять обязанности на лету.
- Можно добавлять несколько новых обязанностей сразу.
- Позволяет иметь несколько мелких объектов вместо одного объекта на все случаи жизни.

1. **Гибкость**
    - Динамическое добавление функций
    - Возможность создавать цепочки декораторов
    - Легкое удаление функций

2. **Принцип единственной ответственности**:
    - Каждый декоратор отвечает за одну функцию
    - Упрощение поддержки кода
    - Четкое разделение обязанностей

3. **Экономия памяти**:
    - Создание декораторов только при необходимости
    - Возможность повторного использования
    - Эффективная структура данных

## Какие недостатки?

- Трудно конфигурировать многократно обёрнутые объекты.
- Обилие крошечных классов.

1. **Сложность отладки**:
    - Сложность определения источника проблемы
    - Усложнение стека вызовов
    - Трудности с отслеживанием цепочки декораторов

2. **Избыточность кода**:
    - Повторение базовых методов
    - Увеличение количества классов
    - Сложность поддержки при большом количестве декораторов

3. **Производительность**:
    - Дополнительные накладные расходы
    - Замедление при глубоких цепочках декораторов
    - Потенциальные проблемы с кэшированием

# Фасад

```ts
// Сервисы подсистемы
class AuthService {
    constructor() {
        this.token = null;
    }

    async login(credentials) {
        // Имитация логина
        this.token = 'mock-token';
        return this.token;
    }

    async logout() {
        this.token = null;
    }
}

class CacheService {
    constructor() {
        this.cache = new Map();
    }

    set(key, value) {
        this.cache.set(key, value);
    }

    get(key) {
        return this.cache.get(key);
    }
}

class LoggerService {
    log(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    error(message, error) {
        console.error(`[${new Date().toISOString()}] ${message}`, error);
    }
}

class APIService {
    constructor() {
        this.authService = new AuthService();
        this.cacheService = new CacheService();
        this.loggerService = new LoggerService();
    }

    async getUserProfile(userId) {
        try {
            const cachedProfile = this.cacheService.get(`profile_${userId}`);

            if (cachedProfile) {
                this.loggerService.log('Возвращаем профиль из кэша');

                return cachedProfile;
            }

            if (!this.authService.token) {
                await this.authService.login({ username: 'user', password: 'pass' });
            }

            this.loggerService.log('Запрашиваем профиль пользователя');
            
            const profile = { id: userId, name: 'Иван Петров' };
            this.cacheService.set(`profile_${userId}`, profile);
            
            return profile;
        } catch (error) {
            this.loggerService.error('Ошибка при получении профиля', error);

            throw error;
        }
    }
}

const apiService = new APIService();

async function demo() {
    try {
        const profile = await apiService.getUserProfile(1);
        
        const cachedProfile = await apiService.getUserProfile(1);
        
        await apiService.authService.logout();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
```

## Для чего нужен этот паттерн?

Фасад - это структурный паттерн проектирования, который предоставляет упрощенный интерфейс к сложной системе из взаимосвязанных классов . Он скрывает сложность подсистемы и предоставляет простой интерфейс для работы с ней.

## В каких случаях стоит использовать?

1. **Упрощение сложных интерфейсов**:
    - Когда система имеет много взаимосвязанных компонентов
    - При необходимости сократить количество зависимостей
    - Когда нужно создать единую точку входа в систему

2. **Изоляция клиентского кода**:
    - Когда нужно защитить клиентский код от изменений в подсистеме
    - При работе с устаревшими системами
    - Когда требуется разделить ответственность

3. **Управление подсистемами**:
    - При работе с большими системами
    - Когда нужно контролировать доступ к подсистеме
    - При необходимости логирования операций

## Какие плюсы?

- Изолирует клиентов от компонентов сложной подсистемы.

1. **Упрощение использования**:
    - Единая точка входа в систему
    - Простой интерфейс для клиентов
    - Сокращение количества зависимостей

2. **Улучшение структуры**:
    - Четкое разделение ответственности
    - Упрощение тестирования
    - Легкость поддержки кода

3. **Гибкость**:
    - Возможность изменения подсистемы без влияния на клиентов
    - Легкое добавление новых функций
    - Изоляция сложной логики

## Какие недостатки?

- Фасад рискует стать божественным объектом, привязанным ко всем классам программы.

1. **Ограничения**:
    - Фасад может стать слишком сложным
    - Сложность поддержки при большом количестве методов
    - Риск создания "Божественного объекта"

2. **Производительность**:
    - Дополнительный уровень индирекции
    - Возможные проблемы с кэшированием
    - Замедление при частых вызовах

3. **Сложность отладки**:
    - Сложность определения источника проблемы
    - Усложнение стека вызовов
    - Трудности с отслеживанием взаимодействий

# Компоновщик

```ts
interface Component {
    render(): void;
    add(component: Component): void;
    remove(component: Component): void;
    getChild(index: number): Component;
}

abstract class BaseComponent implements Component {
    protected children: Component[] = [];

    render(): void {
        this.doRender();
        this.children.forEach(child => child.render());
    }

    add(component: Component): void {
        this.children.push(component);
    }

    remove(component: Component): void {
        const index = this.children.indexOf(component);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    getChild(index: number): Component {
        return this.children[index];
    }

    protected abstract doRender(): void;
}

class Container extends BaseComponent {
    private className: string;

    constructor(className: string = '') {
        super();
        this.className = className;
    }

    protected doRender(): void {
        console.log(`Рендеринг контейнера с классом ${this.className}`);
    }
}

class Button extends BaseComponent {
    private label: string;

    constructor(label: string) {
        super();
        this.label = label;
    }

    protected doRender(): void {
        console.log(`Рендеринг кнопки "${this.label}"`);
    }

    add(component: Component): void {
        throw new Error('Кнопка не может содержать дочерние элементы');
    }

    remove(component: Component): void {
        throw new Error('Кнопка не может удалять дочерние элементы');
    }

    getChild(index: number): Component {
        throw new Error('У кнопки нет дочерних элементов');
    }
}

const container = new Container('main-container');

const loginButton = new Button('Войти');
const registerButton = new Button('Зарегистрироваться');

container.add(loginButton);
container.add(registerButton);

container.render();
```

## Для чего нужен этот паттерн?

Компоновщик - это структурный паттерн проектирования, который позволяет работать с объектами и их группами единообразно. Он создает древовидную структуру объектов, где каждый узел может быть либо простым объектом (лист), либо группой объектов (композит).

## В каких случаях стоит использовать?

- Упрощает архитектуру клиента при работе со сложным деревом компонентов.
- Облегчает добавление новых видов компонентов.

1. **Иерархические структуры**:
    - Файловые системы
    - Графические редакторы
    - Меню и навигация
    - Организационные структуры

2. **Динамическое управление**:
    - Добавление/удаление объектов
    - Перемещение между группами
    - Изменение структуры в runtime

3. **Единообразное поведение**:
    - Обработка как отдельных объектов, так и групп
    - Рекурсивная обработка структуры
    - Единый интерфейс для всех компонентов

## Какие плюсы?

1. **Единообразное управление**:
    - Работа с объектами и группами через единый интерфейс
    - Простая обработка сложных структур
    - Унифицированный доступ к компонентам

2. **Гибкость**:
    - Динамическое создание иерархий
    - Легкое добавление новых типов компонентов
    - Простое управление отношениями между объектами

3. **Эффективность**:
    - Рекурсивная обработка структуры
    - Автоматическое обновление связей
    - Оптимальное использование памяти

## Какие недостатки?

- Создаёт слишком общий дизайн классов.

1. **Сложность реализации**:
    - Необходимость поддержки сложной структуры
    - Сложность отладки
    - Риск циклических зависимостей

2. **Производительность**:
    - Рекурсивные операции могут быть медленными
    - Большой объем данных в памяти
    - Сложность оптимизации

3. **Ограничения**:
    - Сложность добавления новых операций
    - Ограничения при работе с разными типами объектов
    - Риск усложнения структуры при росте системы

# Заместитель

```ts
// Интерфейс для провайдера данных
interface DataProvider {
   getData(key: string): string | null;
   setData(key: string, value: string): void;
}

// Реальный провайдер данных
class RealDataProvider implements DataProvider {
   private storage: Storage;

   constructor(storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
      this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
   }

   getData(key: string): string | null {
      const value = this.storage.getItem(key);
      console.log(`Получение данных из ${this.storage}: ${key}`);
      return value || null;
   }

   setData(key: string, value: string): void {
      console.log(`Сохранение данных в ${this.storage}: ${key}`);
      this.storage.setItem(key, value);
   }
}

// Прокси для кэширования данных
class CachingProxy implements DataProvider {
   private realProvider: RealDataProvider;
   private cache: Map<string, string>;

   constructor(realProvider: RealDataProvider) {
      this.realProvider = realProvider;
      this.cache = new Map<string, string>();
   }

   getData(key: string): string | null {
      // Проверяем кэш
      if (this.cache.has(key)) {
         console.log('Использование кэшированных данных:', key);
         return this.cache.get(key)!;
      }

      // Получаем данные из реального провайдера и сохраняем в кэш
      const data = this.realProvider.getData(key);
      if (data !== null) {
         this.cache.set(key, data);
      }

      return data;
   }

   setData(key: string, value: string): void {
      // Очищаем кэш при обновлении данных
      console.log('Очистка кэша для ключа:', key);
      this.cache.delete(key);
      this.realProvider.setData(key, value);
   }
}

function demo() {
   const realProvider = new RealDataProvider();
   
   clientCode(realProvider);

   const proxyProvider = new CachingProxy(realProvider);
   
   clientCode(proxyProvider);

   const cachedData = proxyProvider.getData('user1');
}

function clientCode(provider: DataProvider) {
   const data1 = provider.getData('user1');

   provider.setData('user1', 'John Doe');

   const data2 = provider.getData('user1');
}
```

## Для чего нужен этот паттерн?

Заместитель - это структурный паттерн проектирования, который предоставляет объект-заместитель для другого объекта
. Заместитель получает запросы от клиентов, выполняет некоторую работу (контроль доступа, кэширование и т.д.) и затем передает запрос реальному объекту.

## В каких случаях стоит использовать?

1. **Контроль доступа**:
    - Ограничение доступа к ресурсам
    - Валидация запросов
    - Логирование операций

2. **Оптимизация**:
    - Кэширование результатов
    - Отложенная инициализация
    - Контроль создания объектов

3. **Защита**:
    - Защита от нежелательных вызовов
    - Контроль ресурсов
    - Обработка ошибок

## Какие плюсы?

- Позволяет контролировать сервисный объект незаметно для клиента.
- Может работать, даже если сервисный объект ещё не создан.
- Может контролировать жизненный цикл служебного объекта.

1. **Гибкость**:
    - Возможность добавления новой функциональности без изменения клиентского кода
    - Легкое переключение между реальным объектом и заместителем
    - Изоляция клиентского кода от сложной логики

2. **Оптимизация**:
    - Кэширование результатов
    - Отложенная загрузка
    - Контроль ресурсов

3. **Безопасность**:
    - Контроль доступа
    - Валидация данных
    - Логирование операций

## Какие недостатки?

- Усложняет код программы из-за введения дополнительных классов.
- Увеличивает время отклика от сервиса.

1. **Сложность**:
    - Дополнительный уровень абстракции
    - Усложнение кода
    - Сложность отладки

2. **Производительность**:
    - Дополнительные накладные расходы
    - Замедление при частых вызовах
    - Потенциальные проблемы с кэшированием

3. **Ограничения**:
    - Сложность добавления новых операций
    - Ограничения при работе с разными типами объектов
    - Риск усложнения структуры при росте системы


# Легковес

```ts
interface FileIcon {
    display(fileName: string): void;
}

class FileIconImpl implements FileIcon {
    private readonly type: string;
    private readonly size: number;
    private readonly color: string;

    constructor(type: string, size: number, color: string) {
        this.type = type;
        this.size = size;
        this.color = color;
    }

    display(fileName: string): void {
        console.log(`Отображение иконки ${this.type} размером ${this.size} для файла ${fileName}`);
    }
}

class IconFactory {
    private static readonly icons: Map<string, FileIcon> = new Map();

    static getIcon(type: string, size: number, color: string): FileIcon {
        const key = `${type}-${size}-${color}`;

        if (!this.icons.has(key)) {
            this.icons.set(key, new FileIconImpl(type, size, color));
        }

        return this.icons.get(key)!;
    }
}

class File {
    constructor(
        private name: string,
        private icon: FileIcon
    ) {}

    display(): void {
        this.icon.display(this.name);
    }
}

const factory = IconFactory;

const pdfIcon = factory.getIcon('PDF', 32, 'red');
const docIcon = factory.getIcon('DOC', 32, 'blue');

const file1 = new File('document1.pdf', pdfIcon);
const file2 = new File('document2.pdf', pdfIcon);
const file3 = new File('document3.doc', docIcon);

file1.display();
file2.display();
file3.display();
```

## Для чего нужен этот паттерн?

Легковес — это структурный паттерн проектирования, который позволяет вместить бóльшее количество объектов в отведённую оперативную память. Легковес экономит память, разделяя общее состояние объектов между собой, вместо хранения одинаковых данных в каждом объекте.

## В каких случаях стоит использовать?

Легковес эффективен в следующих случаях:
- В приложении используется большое количество объектов
- Есть проблема с нехваткой оперативной памяти
- Большую часть состояния объектов можно вынести за пределы их классов
- Большие группы объектов можно заменить относительно небольшим количеством разделяемых объектов

## Какие плюсы?

- Экономит оперативную память

1. Экономия памяти:
- Общие данные хранятся в одном месте
- Множество объектов могут ссылаться на одни и те же данные

2. Улучшение производительности:
- Снижение потребления памяти
- Меньше объектов для сборки мусора

## Какие недостатки?

- Расходует процессорное время на поиск/вычисление контекста.
- Усложняет код программы из-за введения множества дополнительных классов.

1. Дополнительные накладные расходы:
- Расход процессорного времени на поиск/вычисление контекста
- Сложность реализации и поддержки

2. Усложнение кода:
- Необходимость разделения состояния на разделяемое и уникальное
- Дополнительные классы и абстракции


# Мост

```ts
interface IMessageSender {
    send(message: string): void;
}

class EmailSender implements IMessageSender {
    send(message: string): void {
        console.log(`Отправка email: ${message}`);
    }
}

class SMSSender implements IMessageSender {
    send(message: string): void {
        console.log(`Отправка SMS: ${message}`);
    }
}

interface IMessage {
    send(): void;
}

class SimpleMessage implements IMessage {
    private sender: IMessageSender;
    
    constructor(sender: IMessageSender) {
        this.sender = sender;
    }
    
    send(): void {
        this.sender.send("Простое сообщение");
    }
}

class UrgentMessage implements IMessage {
    private sender: IMessageSender;
    
    constructor(sender: IMessageSender) {
        this.sender = sender;
    }
    
    send(): void {
        this.sender.send("СРОЧНО: Простое сообщение");
    }
}

const emailSender = new EmailSender();
const smsSender = new SMSSender();

const emailMessage = new SimpleMessage(emailSender);
const smsMessage = new UrgentMessage(smsSender);

emailMessage.send();
smsMessage.send();
```

## Для чего нужен этот паттерн?

Мост — это структурный паттерн проектирования, который разделяет один или несколько классов на две отдельные иерархии — абстракцию и реализацию, позволяя изменять их независимо друг от друга.

## В каких случаях стоит использовать?

Паттерн эффективен в следующих случаях

- Когда нужно разделить монолитный класс с множеством вариантов функциональности
- Когда требуется расширять класс в нескольких независимых направлениях
- Когда нужно иметь возможность переключать реализации во время выполнения
- Когда требуется уменьшить связанность между абстракцией и реализацией

## Какие плюсы?

- Позволяет строить платформо-независимые программы.
- Скрывает лишние или опасные детали реализации от клиентского кода.
- Реализует принцип открытости/закрытости.

1. Независимое развитие компонентов:
- Абстракция и реализация могут развиваться независимо
- Легко добавлять новые типы абстракций и реализаций
- Минимальное влияние изменений на существующий код

2. Гибкость:
- Возможность переключать реализации во время выполнения
- Простое добавление новых платформ или способов реализации

3. Улучшенная поддерживаемость:
- Каждая иерархия отвечает за свою часть функциональности
- Упрощение тестирования отдельных компонентов

## Какие недостатки?

- Усложняет код программы из-за введения дополнительных классов

1. Усложнение кода:
- Дополнительные интерфейсы и классы
- Сложность для понимания новыми разработчиками

2. Производительность:
- Дополнительные накладные расходы на индирекцию
- Может быть избыточным для простых случаев
