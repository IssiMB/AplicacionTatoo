import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

type Screen = 'inicio' | 'consentimiento' | 'calendario' | 'facturas';

type Appointment = {
  id: number;
  client: string;
  date: string;
  time: string;
  design: string;
  price: string;
  status: 'Pendiente' | 'Confirmada' | 'Pagada';
};

type Invoice = {
  id: number;
  client: string;
  concept: string;
  total: string;
  paid: boolean;
};

const gold = '#d4a84f';
const darkGold = '#9c7330';
const background = '#050505';

const initialAppointments: Appointment[] = [
  {
    id: 1,
    client: 'Laura Martín',
    date: '2026-06-04',
    time: '10:30',
    design: 'Rosa blackwork antebrazo',
    price: '180 €',
    status: 'Confirmada'
  },
  {
    id: 2,
    client: 'David Ramos',
    date: '2026-06-04',
    time: '17:00',
    design: 'Lettering cuello',
    price: '90 €',
    status: 'Pendiente'
  },
  {
    id: 3,
    client: 'Nerea Solís',
    date: '2026-06-05',
    time: '12:00',
    design: 'Mandala pierna',
    price: '320 €',
    status: 'Pagada'
  }
];

const initialInvoices: Invoice[] = [
  { id: 1001, client: 'Laura Martín', concept: 'Reserva + sesión rosa blackwork', total: '180 €', paid: false },
  { id: 1002, client: 'Nerea Solís', concept: 'Mandala pierna completo', total: '320 €', paid: true }
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('inicio');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    client: '',
    date: '',
    time: '',
    design: '',
    price: ''
  });
  const [invoiceForm, setInvoiceForm] = useState({ client: '', concept: '', total: '' });
  const [consentForm, setConsentForm] = useState({
    client: '',
    dni: '',
    phone: '',
    allergies: '',
    signature: ''
  });

  const confirmedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'Confirmada').length,
    [appointments]
  );

  const pendingInvoices = useMemo(() => invoices.filter((invoice) => !invoice.paid).length, [invoices]);

  const addAppointment = () => {
    if (!appointmentForm.client || !appointmentForm.date || !appointmentForm.time) {
      Alert.alert('Faltan datos', 'Añade nombre, fecha y hora para guardar la cita.');
      return;
    }

    setAppointments((current) => [
      ...current,
      {
        id: Date.now(),
        client: appointmentForm.client,
        date: appointmentForm.date,
        time: appointmentForm.time,
        design: appointmentForm.design || 'Diseño pendiente',
        price: appointmentForm.price || 'Por definir',
        status: 'Pendiente'
      }
    ]);
    setAppointmentForm({ client: '', date: '', time: '', design: '', price: '' });
    setAppointmentModalVisible(false);
  };

  const addInvoice = () => {
    if (!invoiceForm.client || !invoiceForm.total) {
      Alert.alert('Faltan datos', 'Añade cliente e importe total para generar la factura.');
      return;
    }

    setInvoices((current) => [
      ...current,
      {
        id: Date.now(),
        client: invoiceForm.client,
        concept: invoiceForm.concept || 'Servicio de tatuaje',
        total: invoiceForm.total,
        paid: false
      }
    ]);
    setInvoiceForm({ client: '', concept: '', total: '' });
    setInvoiceModalVisible(false);
  };

  const saveConsent = () => {
    if (!consentForm.client || !consentForm.dni || !consentForm.signature) {
      Alert.alert('Consentimiento incompleto', 'Completa cliente, DNI y firma para registrar el documento.');
      return;
    }

    Alert.alert('Consentimiento guardado', `Documento registrado para ${consentForm.client}.`);
    setConsentForm({ client: '', dni: '', phone: '', allergies: '', signature: '' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={background} />
      <View style={styles.appShell}>
        <Header screen={screen} goHome={() => setScreen('inicio')} />
        {screen === 'inicio' && (
          <HomeScreen
            confirmedAppointments={confirmedAppointments}
            pendingInvoices={pendingInvoices}
            goToScreen={setScreen}
          />
        )}
        {screen === 'consentimiento' && (
          <ConsentScreen form={consentForm} setForm={setConsentForm} onSave={saveConsent} />
        )}
        {screen === 'calendario' && (
          <CalendarScreen
            appointments={appointments}
            onNewAppointment={() => setAppointmentModalVisible(true)}
            onToggleStatus={(id) =>
              setAppointments((current) =>
                current.map((appointment) =>
                  appointment.id === id
                    ? {
                        ...appointment,
                        status: appointment.status === 'Confirmada' ? 'Pendiente' : 'Confirmada'
                      }
                    : appointment
                )
              )
            }
          />
        )}
        {screen === 'facturas' && (
          <InvoiceScreen
            invoices={invoices}
            onNewInvoice={() => setInvoiceModalVisible(true)}
            onTogglePaid={(id) =>
              setInvoices((current) =>
                current.map((invoice) => (invoice.id === id ? { ...invoice, paid: !invoice.paid } : invoice))
              )
            }
          />
        )}
      </View>
      <AppointmentModal
        visible={appointmentModalVisible}
        form={appointmentForm}
        setForm={setAppointmentForm}
        onClose={() => setAppointmentModalVisible(false)}
        onSave={addAppointment}
      />
      <InvoiceModal
        visible={invoiceModalVisible}
        form={invoiceForm}
        setForm={setInvoiceForm}
        onClose={() => setInvoiceModalVisible(false)}
        onSave={addInvoice}
      />
    </SafeAreaView>
  );
}

function Header({ screen, goHome }: { screen: Screen; goHome: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={goHome} style={styles.headerIcon}>
        <Text style={styles.headerIconText}>☰</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{screen === 'inicio' ? 'Tattoo Studio' : screenLabel(screen)}</Text>
      <Text style={styles.headerIconText}>⋮</Text>
    </View>
  );
}

function HomeScreen({
  confirmedAppointments,
  pendingInvoices,
  goToScreen
}: {
  confirmedAppointments: number;
  pendingInvoices: number;
  goToScreen: (screen: Screen) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.homeContent}>
      <Logo />
      <View style={styles.statsRow}>
        <StatCard label="Citas confirmadas" value={String(confirmedAppointments)} />
        <StatCard label="Facturas pendientes" value={String(pendingInvoices)} />
      </View>
      <View style={styles.menuGrid}>
        <MenuCard icon="✍" label="Consentimiento" onPress={() => goToScreen('consentimiento')} />
        <MenuCard icon="▦" label="Calendario" onPress={() => goToScreen('calendario')} />
        <MenuCard icon="▱" label="Facturas" onPress={() => goToScreen('facturas')} />
      </View>
    </ScrollView>
  );
}

function Logo() {
  return (
    <View style={styles.logoWrapper}>
      <View style={styles.logoCircle}>
        <Text style={styles.machineIcon}>⚙︎</Text>
        <Text style={styles.logoTattoo}>TATTOO</Text>
        <Text style={styles.logoStudio}>— STUDIO —</Text>
      </View>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuCard({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.menuCard} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
    </Pressable>
  );
}

function ConsentScreen({
  form,
  setForm,
  onSave
}: {
  form: { client: string; dni: string; phone: string; allergies: string; signature: string };
  setForm: (form: { client: string; dni: string; phone: string; allergies: string; signature: string }) => void;
  onSave: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <SectionTitle title="Consentimiento informado" subtitle="Registra los datos legales antes de comenzar la sesión." />
      <TextField label="Cliente" value={form.client} onChangeText={(client) => setForm({ ...form, client })} />
      <TextField label="DNI / Pasaporte" value={form.dni} onChangeText={(dni) => setForm({ ...form, dni })} />
      <TextField label="Teléfono" value={form.phone} onChangeText={(phone) => setForm({ ...form, phone })} keyboardType="phone-pad" />
      <TextField
        label="Alergias, medicación o notas médicas"
        value={form.allergies}
        onChangeText={(allergies) => setForm({ ...form, allergies })}
        multiline
      />
      <View style={styles.legalBox}>
        <Text style={styles.legalText}>
          Declaro que he informado correctamente sobre mi estado de salud, autorizo la realización del tatuaje y acepto las
          recomendaciones de cuidado posterior del estudio.
        </Text>
      </View>
      <TextField label="Firma escrita" value={form.signature} onChangeText={(signature) => setForm({ ...form, signature })} />
      <GoldButton label="Guardar consentimiento" onPress={onSave} />
    </ScrollView>
  );
}

function CalendarScreen({
  appointments,
  onNewAppointment,
  onToggleStatus
}: {
  appointments: Appointment[];
  onNewAppointment: () => void;
  onToggleStatus: (id: number) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <SectionTitle title="Agenda de citas" subtitle="Control diario de clientes, diseños, horarios y pagos." />
      <GoldButton label="+ Nueva cita" onPress={onNewAppointment} />
      {appointments.map((appointment) => (
        <Pressable key={appointment.id} style={styles.listCard} onPress={() => onToggleStatus(appointment.id)}>
          <View style={styles.listCardHeader}>
            <Text style={styles.cardTitle}>{appointment.client}</Text>
            <Text style={[styles.badge, appointment.status === 'Pendiente' && styles.badgePending]}>{appointment.status}</Text>
          </View>
          <Text style={styles.cardText}>📅 {appointment.date} · {appointment.time}</Text>
          <Text style={styles.cardText}>🖋 {appointment.design}</Text>
          <Text style={styles.cardPrice}>{appointment.price}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function InvoiceScreen({
  invoices,
  onNewInvoice,
  onTogglePaid
}: {
  invoices: Invoice[];
  onNewInvoice: () => void;
  onTogglePaid: (id: number) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <SectionTitle title="Facturas" subtitle="Crea recibos rápidos y marca cobros completados." />
      <GoldButton label="+ Nueva factura" onPress={onNewInvoice} />
      {invoices.map((invoice) => (
        <Pressable key={invoice.id} style={styles.listCard} onPress={() => onTogglePaid(invoice.id)}>
          <View style={styles.listCardHeader}>
            <Text style={styles.cardTitle}>Factura #{invoice.id}</Text>
            <Text style={[styles.badge, !invoice.paid && styles.badgePending]}>{invoice.paid ? 'Pagada' : 'Pendiente'}</Text>
          </View>
          <Text style={styles.cardText}>Cliente: {invoice.client}</Text>
          <Text style={styles.cardText}>Concepto: {invoice.concept}</Text>
          <Text style={styles.cardPrice}>{invoice.total}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function AppointmentModal({
  visible,
  form,
  setForm,
  onClose,
  onSave
}: {
  visible: boolean;
  form: { client: string; date: string; time: string; design: string; price: string };
  setForm: (form: { client: string; date: string; time: string; design: string; price: string }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <SectionTitle title="Nueva cita" subtitle="Formato recomendado: fecha AAAA-MM-DD y hora HH:MM." />
          <TextField label="Cliente" value={form.client} onChangeText={(client) => setForm({ ...form, client })} />
          <TextField label="Fecha" value={form.date} onChangeText={(date) => setForm({ ...form, date })} />
          <TextField label="Hora" value={form.time} onChangeText={(time) => setForm({ ...form, time })} />
          <TextField label="Diseño / zona" value={form.design} onChangeText={(design) => setForm({ ...form, design })} />
          <TextField label="Precio" value={form.price} onChangeText={(price) => setForm({ ...form, price })} keyboardType="decimal-pad" />
          <View style={styles.modalActions}>
            <GhostButton label="Cancelar" onPress={onClose} />
            <GoldButton label="Guardar" onPress={onSave} compact />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function InvoiceModal({
  visible,
  form,
  setForm,
  onClose,
  onSave
}: {
  visible: boolean;
  form: { client: string; concept: string; total: string };
  setForm: (form: { client: string; concept: string; total: string }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <SectionTitle title="Nueva factura" subtitle="Guarda un recibo sencillo para el cliente." />
          <TextField label="Cliente" value={form.client} onChangeText={(client) => setForm({ ...form, client })} />
          <TextField label="Concepto" value={form.concept} onChangeText={(concept) => setForm({ ...form, concept })} />
          <TextField label="Total" value={form.total} onChangeText={(total) => setForm({ ...form, total })} keyboardType="decimal-pad" />
          <View style={styles.modalActions}>
            <GhostButton label="Cancelar" onPress={onClose} />
            <GoldButton label="Guardar" onPress={onSave} compact />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function TextField({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'decimal-pad' | 'phone-pad';
  multiline?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#7b6a49"
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={label}
      />
    </View>
  );
}

function GoldButton({ label, onPress, compact = false }: { label: string; onPress: () => void; compact?: boolean }) {
  return (
    <Pressable accessibilityRole="button" style={[styles.goldButton, compact && styles.compactButton]} onPress={onPress}>
      <Text style={styles.goldButtonText}>{label}</Text>
    </Pressable>
  );
}

function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.ghostButton} onPress={onPress}>
      <Text style={styles.ghostButtonText}>{label}</Text>
    </Pressable>
  );
}

function screenLabel(screen: Screen) {
  const labels: Record<Screen, string> = {
    inicio: 'Tattoo Studio',
    consentimiento: 'Consentimiento',
    calendario: 'Calendario',
    facturas: 'Facturas'
  };
  return labels[screen];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: background
  },
  appShell: {
    flex: 1,
    backgroundColor: background
  },
  header: {
    alignItems: 'center',
    borderBottomColor: gold,
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 18 : 6,
    paddingBottom: 22
  },
  headerIcon: {
    paddingRight: 8
  },
  headerIconText: {
    color: gold,
    fontSize: 42,
    fontWeight: '700'
  },
  headerTitle: {
    color: gold,
    flex: 1,
    fontSize: 28,
    fontWeight: '800'
  },
  homeContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24
  },
  logoWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 430
  },
  logoCircle: {
    alignItems: 'center',
    borderColor: gold,
    borderRadius: 190,
    borderWidth: 2,
    height: 330,
    justifyContent: 'center',
    shadowColor: gold,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    width: 330
  },
  machineIcon: {
    color: gold,
    fontSize: 92,
    textShadowColor: darkGold,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4
  },
  logoTattoo: {
    color: gold,
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: 4
  },
  logoStudio: {
    color: gold,
    fontSize: 25,
    fontWeight: '700',
    letterSpacing: 5,
    marginTop: 8
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18
  },
  statCard: {
    borderColor: darkGold,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    padding: 16
  },
  statValue: {
    color: gold,
    fontSize: 28,
    fontWeight: '900'
  },
  statLabel: {
    color: '#d9c18a',
    fontSize: 13,
    marginTop: 4
  },
  menuGrid: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between'
  },
  menuCard: {
    alignItems: 'center',
    borderColor: gold,
    borderRadius: 16,
    borderWidth: 2,
    flex: 1,
    minHeight: 132,
    justifyContent: 'center',
    padding: 12
  },
  menuIcon: {
    color: gold,
    fontSize: 44,
    marginBottom: 8
  },
  menuLabel: {
    color: gold,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  screenContent: {
    padding: 22,
    paddingBottom: 48
  },
  sectionTitle: {
    marginBottom: 18
  },
  sectionHeading: {
    color: gold,
    fontSize: 28,
    fontWeight: '900'
  },
  sectionSubtitle: {
    color: '#bfa66c',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6
  },
  inputGroup: {
    marginBottom: 14
  },
  inputLabel: {
    color: gold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7
  },
  input: {
    backgroundColor: '#101010',
    borderColor: darkGold,
    borderRadius: 14,
    borderWidth: 1,
    color: '#fff7df',
    fontSize: 16,
    padding: 14
  },
  multilineInput: {
    minHeight: 94,
    textAlignVertical: 'top'
  },
  legalBox: {
    backgroundColor: '#0f0d08',
    borderColor: gold,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16
  },
  legalText: {
    color: '#dbc28a',
    fontSize: 14,
    lineHeight: 21
  },
  goldButton: {
    alignItems: 'center',
    backgroundColor: gold,
    borderRadius: 14,
    marginVertical: 12,
    padding: 16
  },
  compactButton: {
    flex: 1,
    marginVertical: 0
  },
  goldButtonText: {
    color: '#120d04',
    fontSize: 16,
    fontWeight: '900'
  },
  ghostButton: {
    alignItems: 'center',
    borderColor: gold,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    padding: 16
  },
  ghostButtonText: {
    color: gold,
    fontSize: 16,
    fontWeight: '800'
  },
  listCard: {
    backgroundColor: '#0d0d0d',
    borderColor: darkGold,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 14,
    padding: 18
  },
  listCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 10
  },
  cardTitle: {
    color: '#fff0c3',
    flex: 1,
    fontSize: 20,
    fontWeight: '900'
  },
  badge: {
    backgroundColor: '#17351f',
    borderRadius: 999,
    color: '#9bf0a5',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  badgePending: {
    backgroundColor: '#3b2a0c',
    color: '#ffd77a'
  },
  cardText: {
    color: '#d7c08b',
    fontSize: 15,
    lineHeight: 24
  },
  cardPrice: {
    color: gold,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.76)',
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#080808',
    borderColor: gold,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 22
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  }
});
